const { crawlSite, sites } = require('./crawSites');
const CronJob = require('cron').CronJob;

// every day at 2am
  console.log('Running crawl schedule...');
  sites.forEach(site => crawlSite(site));
// new CronJob('0 2 * * *', () => {
//   console.log('Running crawl schedule...');
//   sites.forEach(site => crawlSite(site));
// }).start();
