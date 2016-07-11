# nginx-reverseproxy

A simple reverse proxy for hosting multiple apps on the same server.
The proxy listens on port 80 and, depending on the domain provided,
redirects the user to a specific port, where one Node app is listening.

This implementation mantains apps independent between themselves, making it so one's bad behaviour won't influence the other.
Apps can also be paused, restarted or updated in an independent form. Changes to the proxy server won't affect an app's behavior, as the app will still stay online even if the server is not.


### Usage
* Install `nginx` on your server (examples using apt):

```
  sudo apt-get install nginx
```

* Edit the `default` server block configuration file:

```
  sudo nano /etc/nginx/sites-available/default
```

* Delete everything on the file, and include your new proxy server:

```
server {
    listen 80;

    server_name example1.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;

    server_name example2.com;
    location / {
        proxy_pass http://localhost:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }   
}

server {
    listen 80;

    server_name example3.com;
    location / {
        proxy_pass http://localhost:8003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }   
}

```
This creates proxies for three apps, each running on a different domain (`server_name`),
and each has a different proxy_pass port, where you app will be running. Make sure each app runs on the same port as the one you choose on the proxy_pass.

* Once you are sure your apps are running on the correct ports, restart the `nginx` service and it should be working as expected:

```
sudo service nginx restart
```

---
###### Extra
* To make it so the user can't access your app ports directly (example1.com:8001), you need to add a `hostname` to your `app.listen` instruction. That way, the proxy will be the only one who can access those ports, so it can redirect to the user.

```
var listener = app.listen(port, 'localhost', function() {
    console.log("Listening on port " + listener.address().port);
});
```

###### Original question can be found at [DigitalOcean](https://www.digitalocean.com/community/questions/two-different-node-apps-with-two-different-domains-in-one-droplet).
---

#### License
MIT License. [Click here for more information.](LICENSE.md)

---
