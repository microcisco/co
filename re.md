#vsftpd服务器

主配置文件部分
---
```java
anonymous_enable=YES  -->  anonymous_enable=NO   //不允许匿名用户访问，默认是允许。
#chroot_list_enable=YES  -->  chroot_list_enable=YES      //不允许FTP用户离开自己主目录，默认是被注释掉的。
#chroot_list_file=/etc/vsftpd/chroot_list --> chroot_list_file=/etc/vsftpd/chroot_list  //如果开启了chroot_list_enable=YES，那么一定要开启这个，这条是锁定登录用户只能家目录的位置，如果不开启用户登录时就会报500 OOPS的错。
local_enable=YES      //允许本地用户访问，默认就是YES，不用改
write_enable=YES      //允许写入，默认是YES，不用改
local_umask=022       //上传后文件的权限掩码，不用改
dirmessage_enable=YES //开启目录标语，默认是YES，开不开无所谓，我是默认就行
xferlog_enable=YES    //开启日志，默认是YES，不用改
connect_from_port_20=YES   //设定连接端口20
xferlog_std_format=YES   //设定vsftpd的服务日志保存路径，不用改（这步后面要有几个操作才能运行，也就是touch这个文件（见第五步），因为它本身不存在，而且还要给文件写入的权限）
#idle_session_timeout=600  -->  idle_session_timeout=600  //会话超时，客户端连接到ftp但未操作，默认被注释掉，可根据个人情况修改
#async_abor_enable=YES  -->   async_abor_enable=YES     //支持异步传输功能，默认是注释掉的，去掉注释
#ascii_upload_enable=YES  -->   ascii_upload_enable=YES   //支持ASCII模式的下载功能，默认是注释掉的，去掉注释
#ascii_download_enable=YES  -->   ascii_download_enable=YES   //支持ASCII模式的上传功能，默认是注释掉的，去掉注释
#ftpd_banner=Welcome to blah FTP service  //FTP的登录欢迎语，本身是被注释掉的，去不去都行
#chroot_local_user=YES  --> chroot_local_user=YES    //禁止本地用户登出自己的FTP主目录，本身被注释掉，去掉注释
pam_service_name=vsftpd  //设定pam服务下vsftpdd的验证配置文件名，不用改
userlist_enable=YES    //拒绝登录用户名单，不用改
TCP_wrappers=YES    //限制主机对VSFTP服务器的访问，不用改（通过/etc/hosts.deny和/etc/hosts.allow这两个文件来配置）增加
guest_enable=YES    //设定启用虚拟用户功能。
guest_username=ftpuser   //指定虚拟用户的宿主用户。
virtual_use_local_privs=YES   //设定虚拟用户的权限符合他们的宿主用户。
user_config_dir=/etc/vsftpd/vconf   //设定虚拟用户个人Vsftp的配置文件存放路径
```
用户的配置文件
---
```js
local_root=/home/virtualuser           //虚拟用户的个人目录路径
anonymous_enable=NO
write_enable=YES
local_umask=022
anon_upload_enable=NO
anon_mkdir_write_enable=NO
idle_session_timeout=600
data_connection_timeout=120
max_clients=10
max_per_ip=5
local_max_rate=1048576     //本地用户的最大传输速度，单位是Byts/s，这里是10M
```
FTP命令详解
---
```js
FTP的命令行格式为：ftp -v -d -i -n -g [主机名]，其中

  -v显示远程服务器的所有响应信息；

  -n限制ftp的自动登录，即不使用；

  .n etrc文件；

  -d使用调试方式；

  -g取消全局文件名。

  ftp使用的内部命令如下(中括号表示可选项):

  1.![cmd[args]]：在本地机中执行交互shell，exit回到ftp环境，如：!ls*.zip.

  2.$ macro-ame[args]：执行宏定义macro-name.

  3.account[password]：提供登录远程系统成功后访问系统资源所需的补充口令。

  4.append local-file[remote-file]：将本地文件追加到远程系统主机，若未指定远程系统文件名，则使用本地文件名。

  5.ascii：使用ascii类型传输方式。

  6.bell：每个命令执行完毕后计算机响铃一次。

  7.bin：使用二进制文件传输方式。

  8.bye：退出ftp会话过程。

  9.case：在使用mget时，将远程主机文件名中的大写转为小写字母。

  10.cd remote-dir：进入远程主机目录。

  11.cdup：进入远程主机目录的父目录。

  12.chmod mode file-name：将远程主机文件file-name的存取方式设置为mode，如：chmod 777 a.out。

  13.close：中断与远程服务器的ftp会话(与open对应)。

  14.cr：使用asscii方式传输文件时，将回车换行转换为回行。

  15.delete remote-file：删除远程主机文件。

  16.debug[debug-value]：设置调试方式，显示发送至远程主机的每条命令，如：deb up 3，若设为0，表示取消debug。

  17.dir[remote-dir][local-file]：显示远程主机目录，并将结果存入本地文件local-file。

  18.disconnection：同close。

  19.form format：将文件传输方式设置为format，缺省为file方式。

  20.get remote-file[local-file]：将远程主机的文件remote-file传至本地硬盘的local-file。

  21.glob：设置mdelete，mget，mput的文件名扩展，缺省时不扩展文件名，同命令行的-g参数。

  22.hash：每传输1024字节，显示一个hash符号(#)。

  23.help[cmd]：显示ftp内部命令cmd的帮助信息，如：help get。

  24.idle[seconds]：将远程服务器的休眠计时器设为[seconds]秒。

  25.image：设置二进制传输方式(同binary)。

  26.lcd[dir]：将本地工作目录切换至dir。

  27.ls[remote-dir][local-file]：显示远程目录remote-dir，并存入本地文件local-file。

  28.macdef macro-name：定义一个宏，遇到macdef下的空行时，宏定义结束。

  29.mdelete[remote-file]：删除远程主机文件。

  30.mdir remote-files local-file：与dir类似，但可指定多个远程文件，如：mdir *.o.*.zipoutfile

  31.mget remote-files：传输多个远程文件。

  32.mkdir dir-name：在远程主机中建一目录。

  33.mls remote-file local-file：同nlist，但可指定多个文件名。

  34.mode[modename]：将文件传输方式设置为modename，缺省为stream方式。

  35.modtime file-name：显示远程主机文件的最后修改时间。

  36.mput local-file：将多个文件传输至远程主机。

  37.newer file-name：如果远程机中file-name的修改时间比本地硬盘同名文件的时间更近，则重传该文件。

  38.nlist[remote-dir][local-file]：显示远程主机目录的文件清单，并存入本地硬盘的local-file。

  39.nmap[inpattern outpattern]：设置文件名映射机制，使得文件传输时，文件中的某些字符相互转换，如：nmap $1.$2.$3[$1，$2].[$2，$3]，则传输文件a1.a2.a3时，文件名变为a1，a2。该命令特别适用于远程主机为非UNIX机的情况。

  40.ntrans[inchars[outchars]]：设置文件名字符的翻译机制，如ntrans R，则文件名LLL将变为RRR。

  41.open host[port]：建立指定ftp服务器连接，可指定连接端口。

  42.passive：进入被动传输方式。

  43.prompt：设置多个文件传输时的交互提示。

  44.proxy ftp-cmd：在次要控制连接中，执行一条ftp命令，该命令允许连接两个ftp服务器，以在两个服务器间传输文件。第一条ftp命令必须为open，以首先建立两个服务器间的连接。

  45.put local-file[remote-file]：将本地文件local-file传送至远程主机。

  46.pwd：显示远程主机的当前工作目录。

  47.quit：同bye，退出ftp会话。

  48.quote arg1，arg2...：将参数逐字发至远程ftp服务器，如：quote syst.

  49.recv remote-file[local-file]：同get。

  50.reget remote-file[local-file]：类似于get，但若local-file存在，则从上次传输中断处续传。

  51.rhelp[cmd-name]：请求获得远程主机的帮助。

  52.rstatus[file-name]：若未指定文件名，则显示远程主机的状态，否则显示文件状态。

  53.rename[from][to]：更改远程主机文件名。

  54.reset：清除回答队列。

  55.restart marker：从指定的标志marker处，重新开始get或put，如：restart 130。

  56.rmdir dir-name：删除远程主机目录。

  57.runique：设置文件名唯一性存储，若文件存在，则在原文件后加后缀..1，.2等。

  58.send local-file[remote-file]：同put。

  59.sendport：设置PORT命令的使用。

  60.site arg1，arg2...：将参数作为SITE命令逐字发送至远程ftp主机。

  61.size file-name：显示远程主机文件大小，如：site idle 7200。

  62.status：显示当前ftp状态。

  63.struct[struct-name]：将文件传输结构设置为struct-name，缺省时使用stream结构。

  64.sunique：将远程主机文件名存储设置为唯一(与runique对应)。

  65.system：显示远程主机的操作系统类型。

  66.tenex：将文件传输类型设置为TENEX机的所需的类型。

  67.tick：设置传输时的字节计数器。

  68.trace：设置包跟踪。

  69.type[type-name]：设置文件传输类型为type-name，缺省为ascii，如：type binary，设置二进制传输方式。

  70.umask[newmask]：将远程服务器的缺省umask设置为newmask，如：umask 3。

  71.user user-name[password][account]：向远程主机表明自己的身份，需要口令时，必须输入口令，如：user anonymous my@email。

  72.verbose：同命令行的-v参数，即设置详尽报告方式，ftp服务器的所有响应都将显示给用户，缺省为on.

  73.?[cmd]：同help。
```