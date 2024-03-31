# Github使用基本操作

## 一、如果是新建一个仓库

### 1.初始化本地git仓库（已实现）

git init

### 2.将本地当前路径下所有文件都添加到本地仓库

git add .

### 3.设置本次修改的备注

git commit -m "写一些你本次修改了什么或者做个标记"

### 4.和Github上的仓库进行连接

git remote add origin    一些不同的链接（git@github.com:dengzhanxixin/test.git）

### 5.建立一个分支名叫main

git branch -M main

### 6.把本地仓库的内容上传到github的        main 分支

git push -u origin main

## 二、如果仓库里已有内容，怎么修改

### 1.新建一个分支

git branch -M    456（自己随便起个名字）

### 2.将本地当前路径下所有文件都添加到本地仓库（每次都切记检查本地当前分支是哪个）

git add .

### 3.设置本次修改的备注

git commit -m "写一些体现本次修改内容的标志"

### 4.把本地仓库的内容上传到github的      对应分支

git push origin 456    （最后的这个456要和  “自己随便起的名字一样”）

### 三、其他操作

### 检查自己本地当前是在哪个分支

git branch

### 把本地的分支改成 某个特定分支 ，这里是改成了 main分支

git checkout main


### 合并分支（这里的意思是把 456 分支 合并到 当前分支里来，456不会变，当前分支的内容会修改），合并完后继续走完上传到github上的操作。

git merge 456

git add .

git commit -m "解决合并冲突"
git push origin main