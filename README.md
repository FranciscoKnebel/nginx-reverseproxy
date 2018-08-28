# nginx-reverseproxy

A simple reverse proxy for hosting multiple apps on the same server.
The proxy listens on port 80 (or 443, if using the HTTP2 implementation) and, depending on the domain provided,
redirects the user to a specific port, where one Node app is listening.

This implementation mantains applications independent between themselves, making it so one's bad behaviour won't influence the other.
Apps can also be paused, restarted or updated in an independent form. Changes to the proxy server won't affect the application behavior, as it will still stay online even if the server is not reachable.


### Usage
1. Install `nginx` on your server (examples using apt):
```
  sudo apt-get install nginx
```

2. Edit the `default` server block configuration file:
```
  sudo nano /etc/nginx/sites-available/default
```

3. Delete everything on the file, and include your new proxy server:
  - If you want the regular HTTP, copy the file `nginx/default`.
  - Otherwise, if you want the HTTP2 version _(recommended)_, use the file `nginx/default-http2`. Please view the tutorial to setup HTTPS in the `Setting up HTTPS` section, as it is needed to run HTTP2.

  This example creates proxies for three apps, each running on a different domain (check the value of `server_name` in each server block), and each running on a different proxy_pass port, where your app will be running.

  **Make sure each app runs on the same port as the one you choose on the proxy_pass.**

4. Once you are sure your apps are running on the correct ports, restart the `nginx` service and it should be working as expected:

```
sudo service nginx restart
```

### Setting up HTTPS

1. Generate your `dhparam.pem` file, running in the terminal
```
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```
#### Create a SSL certificate using Let's Encrypt
~~How to create a certificate, complete guide.~~

~~https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04~~

Using [Certbot](https://certbot.eff.org/) is easier and simpler to configure https://certbot.eff.org/lets-encrypt/ubuntuartful-nginx.

1. Pause Nginx:
```
sudo service nginx stop
```

2. Install Certbot
```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx 
```

3. Create certificate for each site (regular domain and with www):
```
sudo certbot --nginx
```

4. Follow the steps on the screen. Certbot is a smart bot :)

5. Restart Nginx and everything should be working:
```
sudo service nginx restart
```

6.1 To renew the certificates manually
```
sudo certbot renew --dry-run
```
6.2 To renew automatically
```
sudo crontab -e

Insert the next two lines.

30 2 * * 1 /usr/bin/certbot renew --dry-run
35 2 * * 1 /bin/systemctl reload nginx
```

To test your nginx configuration, you can use the following:
```
sudo nginx -t
```
This wil check your configuration for correct syntax and then try to open files referred in configuration.

---
###### Extra
* To make it so the user can't access your app ports directly (example1.com:8001), you need to add a `hostname` to your `app.listen` instruction. That way, the proxy will be the only one who can access those ports, so it can redirect to the user.

```
var listener = app.listen(port, 'localhost', function() {
    console.log("Listening on port " + listener.address().port);
});
```

* https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

###### Original question can be found at [DigitalOcean](https://www.digitalocean.com/community/questions/two-different-node-apps-with-two-different-domains-in-one-droplet).
---

#### License
MIT License. [Click here for more information.](LICENSE)

---
