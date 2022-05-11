---
title: git指令
date: '2022-05-11 23:46:43'
categories:
 - Utils
 - Git
tags:
 - git
 - 指令
---





git commit

提交记录



git branch [branchName]

创建分支



git checkout [branchName]

切换分支



git checkout -b [branchName]

创建并切换分支



git merge [branchName]

从指定分支合并到当前分支



git rebase

从指定分支合并到当前分支【类似剪切】



Head

当前所在活跃节点的指针

一般指向是所开发的分支

通过git checkout 可使其指向具体的提交记录



^

父节点

可携带数字，表示向上移动n次



~

祖先节点

可携带数字，表示向上移动n次

线性



git branch -f [branchName]

强制移动指定分支到当前分支



git reset

撤销本地提交



git revert

撤销远程分支的提交



git cherry-pick 

获取指定修改合并到当前分支









