module.exports = {
    apps: [{
        script: 'my-api',
        watch: '.'
    }, {
        script: './service-worker/',
        watch: ['./service-worker']
    }],

    deploy: {
        production: {
            user: 'root',
            host: '212.227.142.69',
            ref: 'origin/master',
            repo: 'https://github.com/ErickTraore/ikcadci.eu.git',
            path: '/var/www/html',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};