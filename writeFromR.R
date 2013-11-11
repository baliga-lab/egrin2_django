# parse conditions for inclusion into django database
# requires egrin/corem env of choice to be loaded
# e.g.

HALO = F
ECO = T
PLOTS = F

#source("/docs/git/Link-communities/analyze_communities.R")
#environment(motif2) <- out
PVAL = .05

if (ECO) {
	#source("/docs/git/Corems/main.R")
	#source("/docs/git/Corems/processEGRIN.R")
  
	#cwd <- getwd()
	#setwd("/docs/EGRIN2/ecoli/ecoli_corems")
	#o <- loadEnv()
	#setwd(cwd)
  
  outRoot="/isb-1/R/egrin2/website/fixtures/511145/ecoli"
  # from Dave final list of motif.clusters
  # m.table
  load("/docs/EGRIN2/new/Eco_ensemble_2/eco_GRE_table.RData")
  motClusts <- c(0,as.vector(m.table[,1]))
}

if (HALO) {
  # make Halo data in form of Ecoli data - final corem struct, basically
	#load("/isb-1/R/egrin2/gBg_antoine/gBg_backbone_regulons.RData")
	#o <- list()
	#o$corem_list <- list()
	#o$corem_list$corems <- gBg_backbone_0.59_clean_list$regulons
	#o$corem_list$genes <- gBg_backbone_0.59_clean_list$genes
	#o$corem_list$conditions <- gBg_backbone_0.59_clean_list$conditions.cvar
	#o$corem_list$geneontology <- gBg_backbone_0.59_clean_list$geneontology
	#o$corem_list$conditionontology <- gBg_backbone_0.59_clean_list$conditions.cvar.term.enrich
  
  outRoot="/isb-1/R/egrin2/website/fixtures/64091/hal"
  load("/docs/EGRIN2/new/Hal_ensemble/hal_GRE_table.RData")
  motClusts <- c(0,as.vector(m.table[,1]))
}

# Write gene ontology data for gene ontology table
library("GO.db")
go.table  <- toTable(GOTERM)
write.table(go.table,sep="\t",col.names=T,row.names=F,quote=F,file="/isb-1/R/egrin2/website/fixtures/geneontology")

writeInitials <- function(outRoot) {
  unload("filehash")
  unload("filehashRO")
  require(filehashRO)
  require(multicore)
  # write data to initialize django models
  # eg. conditions, biclusters, etc
  
  ####################################
  # corems
  ####################################
  cat("Writing corems\n")
  # corem genes 
  corem_bcs <- lapply(seq(1,length(o$corem_list$genes)),function(i) {
    bcs <- sort(table(unlist(out$get.biclusters(o$corem_list$genes[[i]]))),decreasing=T)
    q <- rev(quantile(bcs,probs=seq(0,1,.1)))[2]
    # filter bcs below user supplied quantile
    bcs <- names(bcs)[bcs>=q]
    return(bcs)
  })
  names(corem_bcs) <- o$corem_list$corems
  
  ####################################
  # !!!relevant bcs!!!
  # only output bcs that are found in 
  # corems or gres!!!
  ####################################
  # relevant.bcs <- sort(unique(c(unlist(corem_bcs),unlist(lapply(strsplit(gsub("MOT_","BIC_",unlist(out$motif.clusts[motClusts[2:length(motClusts)]])),"_"),function(i)paste(i[1],i[2],sep="_"))))))
  # fuck it, just output them all
  relevant.bcs <- paste("BIC_",seq(1:length(e$clusterStack)),sep="")
  
  corem_gres <- lapply(seq(1,length(corem_bcs)),function(i) {
    bcs <- corem_bcs[[i]]
    o <- out$agglom(bcs,'motif.cluster','motif')
    # p val cutoff
    o <- o[o[,3]<.05,]
    # remove bad clusts
    o <- o[!rownames(o)%in%out$bad.clusts,]
    # mot freq cutoff, 5%
    o <- o[(o[,1]/sum(o[,1]))>.05,]
    o2 <- format(o[,3])
    names(o2) <- gsub("MOTC_","",rownames(o))
    o2 <- o2[intersect(names(o2),as.character(motClusts))]
    return(o2)
  })
  names(corem_gres) <- o$corem_list$corems
  # process for writing
  corem_bcs <- lapply(corem_bcs,function(i) paste(gsub("BIC_","",i),collapse=","))
  corem_genes <- lapply(seq(1,length(o$corem_list$genes)),function(i){
    return(paste(o$corem_list$genes[[i]],collapse=","))
  })
  names(corem_genes) <- o$corem_list$corems
  corem_go <- lapply(o$corem_list$corems,function(i){
	#print(i)
    go = NULL
	if (!is.null(o$corem_list$gene.ontology[[i]]$BP)) {
		if (dim(as.matrix(o$corem_list$gene.ontology[[i]]$BP))[1]>0) {
			go <- as.matrix(o$corem_list$gene.ontology[[i]]$BP)[,c("Term","Count","Pop Hits","FDR"),drop=F]
			}
					 
	}
	if (!is.null(o$corem_list$gene.ontology[[i]]$MF)) {
		if (dim(as.matrix(o$corem_list$gene.ontology[[i]]$MF))[1]>0) {
			if (!is.null(go)) {
				go <- rbind(go,as.matrix(o$corem_list$gene.ontology[[i]]$MF)[,c("Term","Count","Pop Hits","FDR"),drop=F])
			} else {
				go <- as.matrix(o$corem_list$gene.ontology[[i]]$MF)[,c("Term","Count","Pop Hits","FDR"),drop=F]
			}
		}
	}
	if (!is.null(o$corem_list$gene.ontology[[i]]$CC)) {
		if (dim(as.matrix(o$corem_list$gene.ontology[[i]]$CC))[1]>0) {
			if (!is.null(go)) {
				go <- rbind(go,as.matrix(o$corem_list$gene.ontology[[i]]$CC)[,c("Term","Count","Pop Hits","FDR"),drop=F])
			} else {
				go <- as.matrix(o$corem_list$gene.ontology[[i]]$CC)[,c("Term","Count","Pop Hits","FDR"),drop=F]
			}
		}
	}
	if (is.null(go)) {
		o <- paste(c("","","",""),sep="\t")
	} else {
		o <- paste(paste(sapply(strsplit(go[,1],"~"),function(i)i[[1]]),collapse=","),paste(go[,2],collapse=","),paste(go[,3],collapse=","),paste(go[,4],collapse=","),sep="\t")			 
	}
	return(o)
  })
  # order corem, genes, bcs, gres, gre_pvals,go_ids,term_descriptions,genes_annotated,go_pval
  # write header
  write(paste(c("corem", "genes", "bcs", "gres", "gre_pvals","go_ids","tot_annotated","genes_annotated","go_pval"),collapse="\t"),file=paste(outRoot,"_corems.txt",sep=""))
  write(paste(paste(o$corem_list$corems,corem_genes,corem_bcs,
                    sapply(corem_gres,function(i)paste(names(i),collapse=",")),
                    sapply(corem_gres,function(i)paste(i,collapse=",")),
                    corem_go,
                    sep="\t"),collapse="\n"),
        file=paste(outRoot,"_corems.txt",sep=""),append=T)
  
  ####################################
  # conds
  ####################################
  conds <- colnames(e$ratios[[1]])
  # this will be the id
  names(conds) <- seq(1,length(conds))
  cat("Writing conds\n")
  # write conds.2 to be loaded after initializing biclusters and such
  cat("Getting bcs\n")
  bcs <- mclapply(conds,function(i) {
    i<-out$get.biclusters(condition=i)[[1]]
    i<-intersect(i,relevant.bcs)
    i<- paste(gsub("BIC_","",i),collapse=",")
    })
  names(bcs) <- conds
  cat("Getting corems\n")
  corems <- lapply(conds,function(i){
    out <- lapply(o$corem_list$corems,function(j){
      tmp.ind <- which(names(o$corem_list$conditions[[j]])==i)
      if (length(tmp.ind)>0) {
        out<-format(round(o$corem_list$conditions[[j]][tmp.ind],8),sci=F)
        names(out) <- j
        return(out)
      } else {
        return(NULL)
      }
      })
    out <- unlist(out)
    return(out)
    })
  names(corems) <- conds
  cat("Getting genes\n")
  genes <- lapply(conds,function(i){
    o <- out$agglom(i,'gene','bicluster','condition')
    o <- o[o[,3]<=PVAL,]
    o <- o[order(o[,3],decreasing=F),]
    o2 <- format(o[,3])
    names(o2) <- rownames(o)
    return(o2)
  })
  names(genes) <- conds
  cat("Getting gres\n")
  # use precomputed bcs -- hopefully speeds it up
  gres <- lapply(seq(1,length(bcs)),function(i){
    o <- out$agglom(paste("BIC_",strsplit(bcs[[i]],split=",")[[1]],sep=""),'motif.cluster','motif','bicluster')
    o <- o[o[,3]<=PVAL,]
    o <- o[order(o[,3],decreasing=F),]
    o2 <- format(o[,3])
    names(o2) <- gsub("MOTC_","",rownames(o))
    o2 <- o2[intersect(names(o2),as.character(motClusts))]
    return(o2)
  })
  names(gres) <- conds
  # cond_id cond_name, bcs, corems, pval, genes, pval, gres, pval
  # write header 
  write(paste(c("cond_id", "cond_name", "bcs", "corems", "pval", "genes", "pval", "gres", "pval"),collapse="\t"),file=paste(outRoot,"_conditions.txt",sep=""))
  write(paste(paste(names(conds), names(corems),bcs,lapply(corems,function(i) paste(names(i),collapse=",")),
                    lapply(corems,function(i) paste(i,collapse=",")),
                    lapply(genes,function(i) paste(names(i),collapse=",")),
                    lapply(genes,function(i) paste(i,collapse=",")),
                    lapply(gres,function(i) paste(names(i),collapse=",")),
                    lapply(gres,function(i) paste(i,collapse=",")),sep="\t"),
              collapse="\n"),file=paste(outRoot,"_conditions.txt",sep=""),append=T)
  
  ####################################
  # biclusters
  # id, resid, genes, conditions
  ####################################
  cat("Writing biclusters\n")
  # info
  count = 1
  relevant.bcs.lookup <- sapply(relevant.bcs,function(i)gsub("BIC_","",i))
  bc.info <- lapply(out$get.bicluster.info(relevant.bcs),
                     function(i){
                       o <- list()
                       # genes
                       o[["genes"]] <- paste(i$rows,collapse=",")
                       # conditions
                       o[["conditions"]] <- paste(unlist(names(conds)[conds%in%i$cols]),collapse=",")
                       # resid
                       o[["resid"]] <- round(i$resid,5)
                       o[["resid"]][is.na(o[["resid"]])] = 1
                       o[["cre"]] <- paste(relevant.bcs.lookup[count],seq(1,dim(i$e.val)[1]),sep="_")
                       o[["gre"]] <- lapply(o[["cre"]],function(i){
                         #print(i)
                         i <- out$get.motif.clusters(motif=paste("MOT_",i,sep=""))
                         if (length(i)==0) {
                           return(0)
                         } else {
                           if (i[[1]]%in%as.character(motClusts)) {
                             return(i[[1]])
                           } else {
                             return(0)
                           }
                         }
                       })
                       count <<- count+1
                       return(o)
                       })
  bc.resid <- sapply(bc.info,function(i)i$resid)
  bc.genes <- sapply(bc.info,function(i)paste(i$genes,collapse=","))
  bc.conditions <- sapply(bc.info,function(i)paste(i$conditions,collapse=","))
  bc.cres <- sapply(bc.info,function(i)paste(i$cre,collapse=","))
  bc.gres <- sapply(bc.info,function(i)paste(intersect(gsub("MOTC_","",i$gre),motClusts),collapse=","))
  # bc, resid, genes, conditions, cres, gres
  # write header
  write(paste(c("bc", "resid", "genes", "conditions", "cres", "gres"),collapse="\t"),
              file=paste(outRoot,"_biclusters.txt",sep=""))      
  write(paste(paste(sapply(relevant.bcs,function(i)strsplit(i,"_")[[1]][2]),bc.resid,bc.genes,bc.conditions,bc.cres,bc.gres,sep="\t"),
              collapse="\n"),file=paste(outRoot,"_biclusters.txt",sep=""),append=T)
  
  
  ####################################
  # GREs
  ####################################
  cat("Writing GREs\n")
  gre <- paste("MOTC_",motClusts,sep="")
  is_pal <- c(0,as.numeric(as.vector(m.table[,3])))
  pal_pval <- c(0,as.numeric(as.vector(m.table[,4])))
  gre.pssms <- lapply(gre,function(i){
    #print(i)
    if (i == 0) {
      return(paste("1,0,0,0,0"))
    } else {
      tmp<-try(attr(out$get.motif.cluster.info(paste("MOTC_",i,sep=""))[[1]],"combined.pssm"),silent=T)
      if (is.matrix(tmp)) {
        tmp.o <- lapply(seq(1,dim(tmp)[1]),function(j){paste(j,paste(round(tmp[j,],5),collapse=","),sep=",")})
        tmp.o <- paste(tmp.o,collapse=":")
        return(tmp.o)
      } else {
        return(paste("1,0,0,0,0"))
      }
    }
    })
  names(gre.pssms) <- motClusts
  # GRE, is_pal, pal_pval, gre_pssm
  # write header
  write(paste(c("gre_id", "is_pal","pal_pval","pssm"),collapse="\t"),file=paste(outRoot,"_gre.txt",sep=""))
  write(paste(paste(names(gre.pssms),is_pal,pal_pval,gre.pssms,sep="\t"),collapse="\n"),file=paste(outRoot,"_gre.txt",sep=""),append=T)
  
  ####################################
  # CREs
  ####################################
  cat("Writing CREs\n")
  cre <- unlist(out$get.motifs(bicluster=relevant.bcs))
  # map to GREs
  gre <- out$get.motif.clusters(cre)
  tmp<-gre[cre]
  names(tmp) <- cre
  tmp[sapply(tmp,is.null)] = 0
  tmp = gsub("MOTC_","",tmp)
  tmp[!tmp%in%motClusts] = 0
  names(tmp) = cre
  # get evals 
  evals <- sapply(out$get.motif.info(cre),function(i) {
    if (is.null(i$e.value)) {
      i = 9999999
      } else {
      i = format(round(i$e.value,8),sci=F)
      }
    })
  # pssms for motifs
  pssms <- lapply(out$get.motif.info(cre),function(i){
    tmp <- i$pssm
    if (is.null(tmp)) {
      return(paste("1,0,0,0,0"))
    } else {
      tmp.o <- lapply(seq(1,dim(tmp)[1]),function(j){paste(j,paste(round(tmp[j,],5),collapse=","),sep=",")})
      tmp.o <- paste(tmp.o,collapse=":")
      return(tmp.o)
    }
    })
  # cre_id, gre_id, eval, pssm
  # write header
  write(paste(c("cre_id", "gre_id", "eval", "pssm"),collapse="\t"),file=paste(outRoot,"_cre.txt",sep=""))
  write(paste(paste(gsub("MOT_","",names(tmp)),tmp,evals,pssms,sep="\t"),collapse="\n"),file=paste(outRoot,"_cre.txt",sep=""),append=T)
  
  ####################################
  # expression
  # make sure ratios are normalized
  ####################################
  cat("Writing ratios\n")
  ratios.norm <- t(scale(t(e$ratios[[1]]), 
                         center = apply(e$ratios[[1]], 1, median, 
                                        na.rm = T), scale = apply(e$ratios[[1]], 
                                                                  1, sd, na.rm = T)))
  exp <- do.call(rbind,lapply(rownames(ratios.norm),function(i){
    do.call(rbind,lapply(colnames(ratios.norm),function(j){
      round(ratios.norm[i,j],5)
    }))
    }))
  exp <- cbind(rownames(ratios.norm),names(conds)[which(colnames(ratios.norm)==conds)],exp)
  # gene, condition, expression
  # write header
  write(paste(c("gene", "condition", "expression"),collapse="\t"),file=paste(outRoot,"_exp.txt",sep=""))
  write(paste(apply(exp,1,function(i) paste(i,collapse="\t")),collapse="\n"),file=paste(outRoot,"_exp.txt",sep=""),append=T)
  
  ####################################
  # genes
  ####################################
  cat("Writing genes, part 2\n")
  gene_gres <- lapply(rownames(e$ratios[[1]]),function(i) {
    # NOTE: changed since initial output -- orginally went thru bcs
    o <- out$agglom(i,'motif.cluster','motif')
    # p val cutoff
    o <- o[o[,3]<=PVAL,]
    # remove bad clusts
    o <- o[!rownames(o)%in%out$bad.clusts,]
    o <- o[order(o[,3],decreasing=F),]
    o2 <- format(o[,3])
    names(o2) <- gsub("MOTC_","",rownames(o))
    o2 <- o2[intersect(names(o2),as.character(motClusts))]
    return(o2)
  })
  names(gene_gres) <- rownames(e$ratios[[1]])
  # gene, gre_id, pval
  # write header
  write(paste(c("gene", "gre_id", "pval"),collapse="\t"),file=paste(outRoot,"_genes_2.txt",sep=""))
  write(paste(paste(names(gene_gres),sapply(gene_gres,function(i) paste(names(i),collapse=",")),
                    sapply(gene_gres,function(i) paste(i,collapse=",")),sep="\t"),collapse="\n"),
        file=paste(outRoot,"_genes_2.txt",sep=""),append=T)
  
  # if ECO write out GRE-TF matchs
  if (ECO) {
    # matches in m.table
    # limit to GREs with match
    m.table.sub <- m.table[which(sapply(as.character(m.table[,7]),nchar)>1),]
    write(paste(c("gre_id", "regulator", "pval"),collapse="\t"),file=paste(outRoot,"_gre_matches.txt",sep=""))
    write(paste(paste(m.table.sub[,1],gsub(" ",",",as.character(m.table.sub[,7])),gsub(" ",",",as.character(m.table.sub[,8])),sep="\t"),collapse="\n"),
          file=paste(outRoot,"_gre_matches.txt",sep=""),append=T)
  }
}

# parseConditions <- function(outFile) {
#   all.conds <- colnames(e$ratios[[1]])
#   # this will be the id
#   names(all.conds) <- seq(1,length(all.conds))
#   bcs <- mclapply(all.conds,function(i){
#     i <- out$get.biclusters(condition=i)
#   })
#   names(bcs) <- names(all.conds)
#   corems <- mclapply(all.conds,function(i){
#     c.names <- sapply(o$corem_list$conditions,names)
#     i <- o$corem_list$corems[sapply(seq(1,length(c.names)),function(j)i%in%c.names[[j]])]
#   })
# }



if (PLOTS) {
  writeExpression <- function(outDir) {
    require(RColorBrewer)
    require(gplots)
    # read array info
    colors <- c(brewer.pal(12,"Paired"),brewer.pal(8,"Dark2"))
    if (ECO) {
      array_info <- read.delim("/isb-1/R/ecoli/distiller/Arrayinfo.txt",sep="\t",header=T)
      condition.categories <- unique(array_info[,6])
      names(condition.categories) <- colors[1:length(condition.categories)]
      condition.categories_inv = names(condition.categories)
      names(condition.categories_inv) = condition.categories
      condition_category_map = array_info[,6]
      names(condition_category_map) = array_info[,2]
    }
    if (HALO) {
      array_info=read.delim("/isb-1/R/egrin2/basic_env_mapping.txt",sep="\t",header=F)
      condition.categories <- unique(array_info[,2])
      names(condition.categories) <- colors[1:length(condition.categories)]
      condition.categories_inv = names(condition.categories)
      names(condition.categories_inv) = condition.categories
      condition_category_map = array_info[,2]
      names(condition_category_map) = array_info[,1]
    }
    # plot legend pdf
    pdf(paste(outDir,"key_labels.pdf",sep=""))
    plot.new()
    legend("topleft",legend=condition.categories,fill=condition.categories_inv)
    dev.off()
    require(gplots)
    blue2yellow <- colorpanel(200,"blue","black","yellow")
    ratios.norm <- t(scale(t(e$ratios[[1]]), 
                           center = apply(e$ratios[[1]], 1, median, 
                                          na.rm = T), scale = apply(e$ratios[[1]], 
                                                                    1, sd, na.rm = T)))
    corems <- o$corem_list$corems
    count = 1
    for (i in corems) {
      print(i)
      g <- intersect(o$corem_list$genes[[i]],rownames(ratios.norm))
      c <- intersect(names(o$corem_list$conditions[[i]]),names(condition_category_map))
      if (length(g)>2) {
        exp <- ratios.norm[g,c]
        if (count == 1) {
          # plot ref for legend
          print("printing legend")
          pdf(paste(outDir,"key_exp.pdf",sep=""))
          heatmap.2(exp[g,c],trace="none",breaks=seq(-5,5,.05),col=blue2yellow,symkey=T,scale="none")
          dev.off()
        }
        png(paste(outDir,i,".png",sep=""),width=480,height=480,bg="transparent")
        # remove conditions for which > 50% are NaN
        c.sub <- sort(apply(exp,2,function(i)sum(is.nan(i))))
        c.sub.2 <- names(c.sub)[which(c.sub<(dim(exp)[1]/2))]
        hc <- hclust(dist(t(exp[g,c.sub.2])))
        cut <- cutree(hc,k=2)
        # order by cut
        cut.order <- sort(cut)
        # cluster 1
        c1 = names(cut.order)[which(cut.order==1)]
        c.col.1 <- condition.categories_inv[condition_category_map[c1]]
        col.order.1 = order(c.col.1)
        c1<- c1[col.order.1]; c.col.1 <- c.col.1[col.order.1]
        # cluster 2
        c2 = names(cut.order)[which(cut.order==2)]
        c.col.2 <- condition.categories_inv[condition_category_map[c2]]
        col.order.2 = order(c.col.2)
        c2<- c2[col.order.2]; c.col.2 <- c.col.2[col.order.2]
        if (mean(exp[,c1],na.rm=T)>0) {
          c <- c(c2,c1); c.col <- c(c.col.2,c.col.1)
        } else {
          c <- c(c1,c2); c.col <- c(c.col.1,c.col.2)
        }
        try(
          heatmap.2(exp[g,c],trace="none",breaks=seq(-5,5,.05),Colv=F,col=blue2yellow,symkey=T,Rowv=T,
                    dendrogram="none",cexRow=1,cexCol=0.01,key=F,ColSideColors=c.col,lhei=c(0,1,0),lwid=c(0,1),margins=c(0,7),scale="none"),
          silent=T
        )
        dev.off()
      } else {
        png(paste(outDir,i,".png",sep=""),width=480,height=480)
        dev.off()
      }
      count=count+1
    }
  }
  
  writeExpression.bcs <- function(outDir) {
    require(RColorBrewer)
    require(gplots)
    # read array info
    colors <- c(brewer.pal(12,"Paired"),brewer.pal(8,"Dark2"))
    if (ECO) {
      array_info <- read.delim("/isb-1/R/ecoli/distiller/Arrayinfo.txt",sep="\t",header=T)
      condition.categories <- unique(array_info[,6])
      names(condition.categories) <- colors[1:length(condition.categories)]
      condition.categories_inv = names(condition.categories)
      names(condition.categories_inv) = condition.categories
      condition_category_map = array_info[,6]
      names(condition_category_map) = array_info[,2]
      n.append = "eco_"
    }
    if (HALO) {
      array_info=read.delim("/isb-1/R/egrin2/basic_env_mapping.txt",sep="\t",header=F)
      condition.categories <- unique(array_info[,2])
      names(condition.categories) <- colors[1:length(condition.categories)]
      condition.categories_inv = names(condition.categories)
      names(condition.categories_inv) = condition.categories
      condition_category_map = array_info[,2]
      names(condition_category_map) = array_info[,1]
      n.append = "hal_"
    }
    blue2yellow <- colorpanel(200,"blue","black","yellow")
    ratios.norm <- t(scale(t(e$ratios[[1]]), 
                           center = apply(e$ratios[[1]], 1, median, 
                                          na.rm = T), scale = apply(e$ratios[[1]], 
                                                                    1, sd, na.rm = T)))
    corem_bcs <- lapply(seq(1,length(o$corem_list$genes)),function(i) {
      bcs <- sort(table(unlist(out$get.biclusters(o$corem_list$genes[[i]]))),decreasing=T)
      q <- rev(quantile(bcs,probs=seq(0,1,.01)))[2]
      # filter bcs below user supplied quantile
      bcs <- names(bcs)[bcs>=q]
      return(bcs)
    })
    names(corem_bcs) <- o$corem_list$corems
    ####################################
    # !!!relevant bcs!!!
    # only output bcs that are found in 
    # corems or gres!!!
    ####################################
    #relevant.bcs <- sort(unique(c(unlist(corem_bcs),unlist(lapply(strsplit(gsub("MOT_","BIC_",unlist(out$motif.clusts[motClusts[2:length(motClusts)]])),"_"),function(i)paste(i[1],i[2],sep="_"))))))
    # fuck it, just output them all
    relevant.bcs <- paste("BIC_",seq(1:length(e$clusterStack)),sep="")
    count = 1
    for (i in relevant.bcs) {
      if (!file.exists(paste(outDir,n.append,strsplit(i,"_")[[1]][2],".png",sep=""))) {
        print(i)
        bc.info <- out$get.bicluster.info(i)[[1]]
        g <- intersect(bc.info$rows,rownames(ratios.norm))
        c <- intersect(bc.info$cols,names(condition_category_map))
        if (length(g)>2) {
          exp <- ratios.norm[g,c]
          if (count == 1) {
            # plot ref for legend
            print("printing legend")
            pdf(paste(outDir,"key_exp.pdf",sep=""))
            heatmap.2(exp[g,c],trace="none",breaks=seq(-5,5,.05),col=blue2yellow,symkey=T,scale="none")
            dev.off()
          }
          png(paste(outDir,n.append,strsplit(i,"_")[[1]][2],".png",sep=""),width=480,height=480,bg="transparent")
          # remove conditions for which > 50% are NaN
          c.sub <- sort(apply(exp,2,function(i)sum(is.nan(i))))
          c.sub.2 <- names(c.sub)[which(c.sub<(dim(exp)[1]/2))]
          hc <- hclust(dist(t(exp[g,c.sub.2])))
          cut <- cutree(hc,k=2)
          # order by cut
          cut.order <- sort(cut)
          # cluster 1
          c1 = names(cut.order)[which(cut.order==1)]
          c.col.1 <- condition.categories_inv[condition_category_map[c1]]
          col.order.1 = order(c.col.1)
          c1<- c1[col.order.1]; c.col.1 <- c.col.1[col.order.1]
          # cluster 2
          c2 = names(cut.order)[which(cut.order==2)]
          c.col.2 <- condition.categories_inv[condition_category_map[c2]]
          col.order.2 = order(c.col.2)
          c2<- c2[col.order.2]; c.col.2 <- c.col.2[col.order.2]
          if (mean(exp[,c1],na.rm=T)>0) {
            c <- c(c2,c1); c.col <- c(c.col.2,c.col.1)
          } else {
            c <- c(c1,c2); c.col <- c(c.col.1,c.col.2)
          }
          try(
            heatmap.2(exp[g,c],trace="none",breaks=seq(-5,5,.05),Colv=F,col=blue2yellow,symkey=T,Rowv=T,
                      dendrogram="none",cexRow=1,cexCol=0.01,key=F,ColSideColors=c.col,lhei=c(0,1,0),lwid=c(0,1),margins=c(0,7),scale="none"),
            silent=T
          )
          dev.off()
        } else {
          png(paste(outDir,n.append,strsplit(i,"_")[[1]][2],".png",sep=""),width=480,height=480)
          plot.new()
          dev.off()
        }
      }
      count=count+1
    }
  }
  out$plot.promoter.architecture.ab <- function (gene, window = 250, shift = 250, e.value.cutoff = Inf, 
                                                 p.value.cutoff = 1e-05, op.shift = F, include.bad = F, verbose = T, 
                                                 biclust.filter = NULL, motif.filter = NULL, meme.hits.only = F, 
                                                 dont.plot = F, ...) 
  {
    if (is.character(gene)) {
      coo <- e$get.gene.coords(gene, op.shift = op.shift)
      if (is.null(coo)) 
        return(NULL)
      print(coo)
      st.st <- c(coo$start_pos, coo$end_pos)
      if (coo$strand == "R") 
        st.st <- rev(st.st)
      st.st <- st.st[1] + c(-window, +window) + (if (coo$strand == 
        "R") 
        +shift
                                                 else -shift)
      chr <- as.character(coo$contig)
      names(st.st)[1] <- chr
    }
    else {
      if (length(gene) >= 2) 
        st.st <- gene
      else if (length(gene) == 1) 
        st.st <- gene + c(-1, 1) * window/2
    }
    if (!meme.hits.only) {
      if (!exists("pssm.scans")) 
        pssm.scans <- get.pssm.scans()
      if (p.value.cutoff < max(pssm.scans$pvals, na.rm = T)) 
        pssm.scans <- pssm.scans[pvals <= p.value.cutoff]
      if (!is.data.table(pssm.scans)) {
        pssm.scans <- as.data.table(pssm.scans)
        gc()
        setkey(pssm.scans, bic, mots, gene, posns)
      }
    }
    else {
      if (!exists("meme.hits")) {
        meme.hits <- get.meme.genome.positions()
      }
      meme.hits <- subset(meme.hits, p.value <= p.value.cutoff)
      meme.hits <- as.data.table(meme.hits)
      gc()
      setkey(meme.hits, bic, mot, gene, genome.posns)
    }
    if (st.st[1] < 1) 
      st.st[1] <- 1
    chr <- names(st.st)[1]
    if (is.null(chr)) {
      chr <- names(which(sapply(e$genome.info$genome.seqs, 
                                nchar) == max(sapply(e$genome.info$genome.seqs, nchar))))
      names(st.st)[1] <- chr
    }
    if (!meme.hits.only) {
      scans <- pssm.scans[gene == chr & posns %betw% (st.st + 
        c(-100, 100))]
      scans <- unique(scans)
      motifs <- unique(paste("MOT", scans$bic, abs(scans$mots), 
                             sep = "_"))
    }
    else {
      chr2 <- chr
      rm(chr)
      scans <- meme.hits[chr == chr2 & genome.posns %betw% 
        (st.st + c(-1000, 1000))]
      chr <- chr2
      rm(chr2)
      scans <- unique(scans)
      motifs <- unique(paste("MOT", scans$bic, abs(scans$mot), 
                             sep = "_"))
    }
    if (length(motifs) <= 0) 
      stop("No motifs pass criteria (1)!")
    if (verbose) 
      cat(length(motifs), "motifs.\n")
    if (!is.null(biclust.filter)) {
      motifs <- motifs[motifs %chin% unlist(get.motifs(biclust = biclust.filter))]
      if (length(motifs) <= 0) 
        stop("No motifs pass criteria! (2)")
    }
    if (!is.null(motif.filter)) {
      motifs <- motifs[motifs %chin% motif.filter]
      if (length(motifs) <= 0) 
        stop("No motifs pass criteria! (3)")
    }
    if (!include.bad && exists("bad.clusts")) {
      bad.ms <- unique(unlist(get.motifs(motif.clust = bad.clusts, 
                                         expand = F)))
      motifs <- motifs[!motifs %chin% bad.ms]
      if (length(motifs) <= 0) 
        stop("No motifs pass criteria! (4)")
    }
    if (!is.infinite(e.value.cutoff) && !is.na(e.value.cutoff)) {
      minfo <- get.motif.info(motifs = motifs)
      e.vals <- do.call(c, lapply(minfo, function(tmp) {
        if (is.null(tmp)) 
          return(NA)
        return(tmp$e.value)
      }))
      motifs <- motifs[e.vals <= e.value.cutoff]
      if (length(motifs) <= 0) 
        stop("No motifs pass criteria! (5)")
    }
    if (!include.bad) {
      if (exists("coding.fracs")) {
        frac.in.coding <- coding.fracs$all.fracs[motifs]
      }
      else {
        coding.fracs <- get.motif.coding.fracs(motifs, verbose = T)
        frac.in.coding <- coding.fracs$all.fracs
      }
      motifs.orig <- motifs
      motifs <- motifs[!is.na(frac.in.coding) & frac.in.coding < 
        coding.fracs$mean.fracs - 0.01]
      if (length(motifs) <= 0) 
        stop("No motifs pass criteria! (6)")
      rm(coding.seqs, scans, in.coding)
    }
    if (verbose) 
      cat(length(motifs), "motifs remain.\n")
    mots <- strsplit(gsub("MOT_", "", motifs), "_")
    bi <- as.integer(sapply(mots, "[", 1))
    mo <- as.integer(sapply(mots, "[", 2))
    if (!meme.hits.only) {
      scans <- pssm.scans[J(c(bi, bi), c(mo, -mo), chr)]
      scans <- scans[!is.na(scans$posns), ]
      scans <- scans[scans$posns %betw% (st.st + c(-500, 500)), 
                     ]
    }
    else {
      scans <- meme.hits[J(c(bi, bi), c(mo, -mo))]
      scans <- scans[!is.na(scans$genome.posns), ]
      scans <- scans[scans$genome.posns %betw% (st.st + c(-500, 
                                                          500)), ]
      colnames(scans)[2] <- "mots"
      colnames(scans)[8] <- "posns"
      scans$posns <- scans$posns + 1
      scans$mots[scans$strand == "-"] <- -scans$mots[scans$strand == 
        "-"]
      scans$mots[scans$gene.strand == "R"] <- -scans$mots[scans$gene.strand == 
        "R"]
    }
    setkey(scans, "bic", "mots")
    getEntropy <- function(pssm) {
      pssm[pssm == 0] <- 1e-05
      entropy <- apply(pssm, 1, function(i) -sum(i * log2(i)))
      return(entropy)
    }
    seq <- substr(e$genome.info$genome.seqs[names(st.st)[1]], 
                  st.st[1], st.st[2])
    mat <- matrix(0, nrow = diff(st.st) + 1, ncol = 4)
    rownames(mat) <- as.character(st.st[1]:st.st[2])
    colnames(mat) <- e$col.let
    mat2 <- mat * 0
    scans <- scans[scans$posns %betw% (st.st + c(-100, 100))]
    if (exists("motif.clusts")) {
      mcs <- get.motif.clusters(motif = motifs)
      mot.tab <- sort(table(unlist(mcs)))[sort(table(unlist(mcs))) > 
        2]
      print(mot.tab)
    }
    else {
      mot.tab <- character()
    }
    if (length(mot.tab) > 10) 
      mot.tab <- mot.tab[-(0:9) + length(mot.tab)]
    counts <- matrix(0, nrow = nrow(mat), ncol = length(mot.tab))
    colnames(counts) <- names(mot.tab)
    rownames(counts) <- rownames(mat)
    counts2 <- counts
    if (nrow(scans) > 0) {
      bics <- unique(scans$bic)
      for (k in bics) {
        if (verbose) {
          wh <- which(bics == k)
          if (wh%%100 == 1) 
            cat(k, wh, length(bics), "\n")
        }
        sc <- scans[bic == k]
        mots <- unique(abs(sc$mots))
        for (m in mots) {
          width <- motif.widths[k, m]
          if (width <= 0) 
            next
          if (exists("mcs")) {
            mc <- mcs[[paste("MOT", k, m, sep = "_")]]
            mc <- mc[mc %chin% colnames(counts)]
          }
          pssm.orig <- get.motif.info(paste("MOT", k, m, 
                                            sep = "_"))[[1]]$pssm
          pssm.rev <- pssm.orig[nrow(pssm.orig):1, 4:1]
          entr <- getEntropy(pssm.orig)
          scale.e.orig <- (2 - entr)/2
          scale.e.rev <- rev(scale.e.orig)
          pssm.orig2 <- pssm.orig * scale.e.orig
          pssm.rev2 <- pssm.rev * scale.e.rev
          sc2 <- sc[abs(sc$mots) == m]
          inds.pssm <- 1:nrow(pssm.orig)
          for (i in 1:nrow(sc2)) {
            mot <- sc2$mots[i]
            pssm <- pssm.orig
            pssm2 <- pssm.orig2
            scale.e <- scale.e.orig
            if (sign(mot) == -1) {
              pssm <- pssm.rev
              pssm2 <- pssm.rev2
              scale.e <- scale.e.rev
            }
            posn <- sc2$posns[i]
            inds <- (posn - 1):(posn - 2 + width)
            inds.1 <- inds.pssm[inds %betw% st.st]
            if (length(inds.1) <= 0) 
              next
            inds <- inds[inds %betw% st.st]
            inds <- as.character(inds)
            mat[inds, ] <- mat[inds, ] + pssm[inds.1, ]
            mat2[inds, ] <- mat2[inds, ] + pssm2[inds.1, 
                                                 ]
            if (exists("mc") && length(mc) > 0 && !is.null(mc)) {
              counts[inds, mc] <- counts[inds, mc] + 1
              counts2[inds, mc] <- counts2[inds, mc] + 
                scale.e[inds.1]
            }
          }
        }
      }
    }
    if (dont.plot) 
      return(invisible(list(motifs = motifs, scans = scans, 
                            mat = mat, mat2 = mat2, counts = counts, st.st = st.st, 
                            mot.tab = mot.tab)))
    #par(mfrow = c(2, 1))
    layout(matrix(c(1,2),2,1),heights=c(.7,.3))
    yr <- e$viewPssm(mat, scale.e = apply(mat, 1, sum), no.axis.labels = T, 
                     ...)
    axis(1, labels = rownames(mat)[seq(1, nrow(mat), by = 10)], 
         at = seq(1, nrow(mat), by = 10), line = -0.3)
    if (ncol(counts) > 0) {
      counts[counts <= 0] <- NA
      counts2[counts2 <= 0] <- NA
      for (i in 2:(nrow(counts) - 1)) {
        counts[i, is.na(counts[i, ]) & !is.na(counts[i - 
          1, ]) & counts[i - 1, ] > 0] <- 0
        counts[i, is.na(counts[i, ]) & !is.na(counts[i + 
          1, ]) & counts[i + 1, ] > 0] <- 0
        counts2[i, is.na(counts2[i, ]) & !is.na(counts2[i - 
          1, ]) & counts2[i - 1, ] > 0] <- 0
        counts2[i, is.na(counts2[i, ]) & !is.na(counts2[i + 
          1, ]) & counts2[i + 1, ] > 0] <- 0
      }
      counts1a <- counts * max(yr)/(max(counts, na.rm = T) * 
        1.2)
      if (ncol(counts1a) > 0) 
        matlines(counts1a, typ = "l", lwd = 3, col = 1:ncol(counts), 
                 lty = (1:ncol(counts)%/%8) + 1)
      leg.count <- apply(counts, 2, max, na.rm = T)
      if (exists("motif.clusts")) 
        leg.count <- mot.tab[colnames(counts)]
      if (coo$strand == "R") {
        legend("topright", legend = paste(gsub("MOTC_","GRE ",colnames(counts)), leg.count), 
               lwd = 3, col = 1:ncol(counts), lty = (1:ncol(counts)%/%8) + 
                 1, cex = 0.6, horiz = F, trace = F, seg.len = 5)
      } else {
        legend("topleft", legend = paste(gsub("MOTC_","GRE ",colnames(counts)), leg.count), 
               lwd = 3, col = 1:ncol(counts), lty = (1:ncol(counts)%/%8) + 
                 1, cex = 0.6, horiz = F, trace = F, seg.len = 5)
      }
    }
    
    plot.genes.in.region(mean(st.st[1:2]), chr, diff(range(st.st[1:2])), 
                         new = T, yscale = 0.5)
    mat3 <- mat * 0
    mat3[cbind(rownames(mat3), strsplit(seq, "")[[1]])] <- 1
    e$viewPssm(mat3, scale.e = rep(0.6, nrow(mat3)), new=F, 
               xoff = min(as.integer(rownames(mat))) - 1, yoff = .5, 
               no.axis.labels = T, ...)
    par(xpd = F)
    #   e$viewPssm(mat2, scale.e = apply(mat2, 1, sum), no.axis.labels = T, 
    #              ...)
    #   yr <- e$viewPssm(mat2 * mat3, scale.e = apply(mat2 * mat3, 
    #                                                 1, sum), no.axis.labels = T, ...)
    #   if (ncol(counts2) > 0) {
    #     counts2 <- counts * max(yr)/(max(counts, na.rm = T) * 
    #       1.2)
    #     matlines(counts2, typ = "l", lwd = 3, col = 1:ncol(counts), 
    #              lty = (1:ncol(counts)%/%8) + 1)
    #   }
    #   axis(1, labels = rownames(mat)[seq(1, nrow(mat), by = 10)], 
    #        at = seq(1, nrow(mat), by = 10), line = -0.3)
    invisible(list(motifs = motifs, scans = scans, mat = mat, 
                   mat2 = mat2, mat3 = mat3, counts = counts, st.st = st.st, 
                   mot.tab = mot.tab))
  }
  environment(out$plot.promoter.architecture.ab) <- out
  
  writePromoterArchitecture <- function(outDir) {
    g <- rownames(e$ratios[[1]])
    for (i in g) {
      png(paste(outDir,i,".png",sep=""),width=1000,height=500,bg="transparent")
      try(out$plot.promoter.architecture.ab(i,motif.filter=unlist(out$mot.clusts[motClusts[2:length(motClusts)]]),p.value.cutoff = 1e-06),silent=T)
      dev.off()
    }
  }
  
  writeGRES <- function(outDir) {
    gre <- motClusts
    gre.pssms <- lapply(gre,function(i){
      png(paste(outDir,i,".png",sep=""),width=500,height=500,bg="transparent")
      plot.new()
      if (i != 0) {
        if (ECO) {
          tmp <- attr(out$get.motif.cluster.info(paste("MOTC_",i,sep=""))[[1]],"combined.pssm")
          try(e$viewPssm(tmp),silent=T)
        } else if (HALO) {
          tmp <- try(attr(out$tt.out2[[i]]$tttt.out[[1]],"combined.pssm"),silent=T)
          try(e$viewPssm(tmp),silent=T)
        }
      }
      dev.off()
    })
  }
  
  writeCRES <- function(outDir) {
    # corem genes 
    corem_bcs <- lapply(seq(1,length(o$corem_list$genes)),function(i) {
      bcs <- sort(table(unlist(out$get.biclusters(o$corem_list$genes[[i]]))),decreasing=T)
      q <- rev(quantile(bcs,probs=seq(0,1,.01)))[2]
      # filter bcs below user supplied quantile
      bcs <- names(bcs)[bcs>=q]
      return(bcs)
    })
    names(corem_bcs) <- o$corem_list$corems
    
    ####################################
    # !!!relevant bcs!!!
    # only output bcs that are found in 
    # corems or gres!!!
    ####################################
    #relevant.bcs <- sort(unique(c(unlist(corem_bcs),unlist(lapply(strsplit(gsub("MOT_","BIC_",unlist(out$motif.clusts[1:motClusts])),"_"),function(i)paste(i[1],i[2],sep="_"))))))
    # fuck it, just output them all
    relevant.bcs <- paste("BIC_",seq(1:length(e$clusterStack)),sep="")
    cre <- unlist(out$get.motifs(biclusters=relevant.bcs))
    cre.pssms <- lapply(cre,function(i){
      if (ECO) {
        n.append = "eco_"
      } else if (HALO) {
        n.append = "hal_"
      }
      if (!file.exists(paste(outDir,n.append,gsub("MOT_","",i),".png",sep=""))) {
        png(paste(outDir,n.append,gsub("MOT_","",i),".png",sep=""),width=500,height=500,bg="transparent")
        tmp <- out$get.motif.info(paste(i,sep=""))[[1]]$pssm
        plot.new()
        try(e$viewPssm(tmp),silent=T)
        dev.off()
      }
    })
  }
  
  cleanHaloMicrobesOnline <- function(file,out) {
    f = as.matrix(read.delim(file,sep="\t",header=T))
    trans = read.delim("/isb-1/tmp/fixtures/64091/Hal_genes_translation.txt",header=F,row.names=2,sep="\t")
    trans.v = unlist(trans); names(trans.v) = rownames(trans)
    f[which(f[,8]%in%rownames(trans)),8] = as.vector(trans.v[as.vector(f[which(f[,8]%in%rownames(trans)),8])])
    write.table(f,file=out,quote=F,col.names=T,row.names=F,sep="\t")
  }
  
  writeRegulonDBTFs <- function(outDir) {
    load("/isb-1/R/ecoli/eco_pssms.rdata")
    # get list of regulators
    tfs <- unique(c(names(pssms2),names(pssms)))
    tf.pssms <- lapply(tfs,function(i){
      png(paste(outDir,i,".png",sep=""),width=500,height=500,bg="transparent")
      plot.new()
      if (i%in%names(pssms2)) {
        try(e$viewPssm(pssms2[[i]]),silent=T)
      } else if (i%in%names(pssms)) {
        try(e$viewPssm(pssms[[i]]),silent=T)
      }
      dev.off()
    })
  }
}
