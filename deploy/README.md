# 把音迹部署到 huanxuanhealthcare.tech

域名现在还指着 Manus（`cname.manus.space`），所以会 503。服务器跑起来之后，到 Cloudflare 把这条 CNAME 删掉，改成指向你服务器公网 IP 的 **A 记录**。

需要：Ubuntu 22+、**Node 22**、Nginx。目录用 `/opt/yinji`。

## 最快：用现成构建

压缩包里已经有 `.output/`（Linux x64 构建）。服务器上只需要 Node 22，不必再 `npm run build`。

```bash
sudo mkdir -p /opt/yinji
sudo tar -xzf yinji-huanxuanhealthcare.tgz -C /tmp
sudo rsync -a /tmp/yinji/ /opt/yinji/
sudo chown -R www-data:www-data /opt/yinji
```

试跑：

```bash
sudo -u www-data env HOST=127.0.0.1 PORT=3000 node /opt/yinji/.output/server/index.mjs
```

本机 `curl http://127.0.0.1:3000/` 应返回「音迹」页面。Ctrl+C 停掉后走下面的 systemd。

## systemd 常驻

```bash
sudo cp /opt/yinji/deploy/yinji.service /etc/systemd/system/yinji.service
# 若 which node 不是 /usr/bin/node，改 service 里的 ExecStart
sudo systemctl daemon-reload
sudo systemctl enable --now yinji
sudo systemctl status yinji --no-pager
```

## Nginx 反代

```bash
sudo cp /opt/yinji/deploy/nginx-huanxuanhealthcare.tech.conf /etc/nginx/sites-available/huanxuanhealthcare.tech
sudo ln -sf /etc/nginx/sites-available/huanxuanhealthcare.tech /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 改 DNS（必须，否则还是 Manus 的 503）

Cloudflare DNS：

1. 删除指向 `cname.manus.space` 的 CNAME
2. 添加 `A`：`huanxuanhealthcare.tech` → 你的服务器公网 IP
3. 可选 `A`：`www` → 同一 IP
4. 先把云朵点成 **DNS only（灰云）**，方便申请证书
5. 证书好了若要开橙云，SSL/TLS 选 **Full (strict)**

## HTTPS

灰云状态下：

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d huanxuanhealthcare.tech -d www.huanxuanhealthcare.tech
```

之后打开 https://huanxuanhealthcare.tech/

## 以后从源码重建（可选）

需要 Node 22 + 完整源码：

```bash
cd /opt/yinji
npm ci
npm run build:node
sudo systemctl restart yinji
```

进度存在每位学员浏览器本地，服务器不需要数据库。
