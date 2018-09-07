const path = require('path');
const { Config } = require('../../models');

const appConf = new Config().app;

exports.vueOptions = {
    head: {
        title: appConf.name,
        metas: [
            { name: "ROBOTS", content: "NOINDEX,NOFOLLOW" },
            { property: 'og:title', content: appConf.name },
            { name: 'twitter:title', content: appConf.name },
        ],
        scripts: [{ src: "https://unpkg.com/axios/dist/axios.min.js" }]
    }
}