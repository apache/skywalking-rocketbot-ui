#!/bin/bash

set -x
set -e

absolute_path="/etc/nginx/nginx.conf"

#absolute_path="nginx.conf"

ngx_upstream_file=$absolute_path

pool_name="skywalkingLB"

# mv ${absolute_path} ${absolute_path}.old
# cat ${absolute_path}.old | sed s#SKYWALKING_URL#${SKYWALKING_URL}#g  >  ${absolute_path}

skywalking_collector=${SKYWALKING_URL}

#skywalking_collector=localhost:1234,127.0.0.1:1235

 #pool对应ip地址列表,多个ip以逗号改开
pool_ip=`awk 'BEGIN{list="'${skywalking_collector}'";split(list,ip_list,",");for(ip in ip_list){print ip_list[ip];}}'`
for ip in ${pool_ip[*]};do
    echo "add ${pool_name} ${ip} in ${ngx_upstream_file}"
    sed -i '/upstream '${pool_name}'[^-]*{/a\\server '${ip}';' ${ngx_upstream_file}
done

echo -e "\033[31m ====add nginx.conf :==== \033[0m"
cat $absolute_path
