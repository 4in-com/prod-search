const axios = require('axios');
const cheerio = require('cheerio');
const supabase = require('./supaClient');


const sites = [
   { 
   name: 'kilimall',
  baseUrl: 'https://www.kilimall.co.ke',
   listUrl: 'https://www.kilimall.co.ke/category/Clothes?id=167&form=category&source=category|allCategory|Clothes',
   listItemSelector: '.product-item',
   imageSelector: '.lazy',
   titleSelector: '.product-title',
   priceSelector: '.product-price',
   linkSelector: 'a', 
        }, 
        { 
   name: 'slot',
  baseUrl: 'https://slot.ng',
   listUrl: 'https://slot.ng/category/accessoriess',
   listItemSelector: '.product-item__outer',
   imageSelector: '.product-item__body img',
   titleSelector: '.product-item__title a',
   priceSelector: '.prodcut-price .text-gray-100',
   linkSelector: '.product-item__title a', 
        }, 
        // Add more here after checking robots.txt 
        ];


async function crawlSite(site) {
  console.log('Crawling', site.name);

  try {
    const { data } = await axios.get(site.listUrl);
    const $ = cheerio.load(data);

    const products = [];
    $(site.listItemSelector).each((_, el) => {
      const title = $(el).find(site.titleSelector).text().trim();
      const price = $(el).find(site.priceSelector).text().trim();
      let link = $(el).find(site.linkSelector).attr('href');
      if (link && link.startsWith('/')) {link = site.baseUrl + link;}

       const image_url = $(el).find(site.imageSelector).attr('data-src') ||
    $(el).find(site.imageSelector).attr('src') ||
    '';

      if (title) {
        products.push({
          source_url:link,
          title,
          price,
          image_url
        });
      }
    });

    // Insert into Supabase
    for (let p of products) {
      await supabase.from('products').insert(p);
    }

    console.log(`Inserted ${products.length} items from ${site.name}`);
  } catch (err) {
    console.error('Crawl error', site.name, err.message);
  }
}

module.exports = { crawlSite, sites };