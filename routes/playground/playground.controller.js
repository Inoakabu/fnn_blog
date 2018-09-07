const { Config } = require('../../models');
const { vueOptions } = require('../../utils');

const appConf = new Config().app;

module.exports = (router, db) => {
    router.get('/playground', (req, res) => {
        const data = {
            data: appConf.name
        };
        res.renderVue("playground/playground.vue", data, vueOptions);
    });
};