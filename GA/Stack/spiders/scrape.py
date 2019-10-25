# -*- coding: utf-8 -*-
# scrapy runspider scrape.py -o output.json
import scrapy
from scrapy.http import Request
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from Stack.items import StackItem

from urllib.parse import urljoin

from collections import Counter

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords


class ScrapeSpider(CrawlSpider):
    name = 'scrape'
    allowed_domains = []
    start_urls = ['https://www.w3schools.com/html', 'https://en.wikipedia.org/wiki/Rome', 'https://stackoverflow.com/questions']
    rules = (
        Rule(LinkExtractor(), callback='parse_item', follow=True),
    )

    def get_common_words(self, text, amount):
        c = Counter(text.split())
        return c.most_common(amount)

    def remove_stopwords(self, text):
        stopWords = set(stopwords.words('english'))
        words = word_tokenize(text)
        wordsFiltered = []

        for w in words:
            if w not in stopWords:
                if len(w) > 2 and not w.isdigit():
                    wordsFiltered.append(w)

        return ' '.join(wordsFiltered)

    def clean_string(self, my_string):
        new_string = my_string
        for c in ['/', '\'', '\n', '\t', '[', ']', '{', '}', '"', '(', ')', '.', ',', '?', ':', ';', '^', "'", '-', '%', '#', '>', '<']:
            if c in my_string:
                new_string = new_string.replace(c, ' ')

        return new_string

    def parse_item(self, response):

        item = StackItem()
        item['title'] = response.xpath('//title/text()').extract_first(default='')
        item['url'] = response.url
        cleanedText = self.clean_string(
            ''.join(response.xpath('//body//text()').extract()).strip().lower())
        noStopWords = self.remove_stopwords(cleanedText)
        item['body'] = self.get_common_words(noStopWords, 10)
        item['summary'] = response.xpath("//meta[contains(translate(@name, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'description')]/@content | (//p//text())[position() < 6]").extract_first(default='')
        item['lang'] = response.xpath("//html//@lang").extract_first(default='en')

        yield item

        for url in response.xpath('//a/@href').extract():
            if url and not url.startswith('#'):
                #self.logger.debug(urljoin(response.url, url))
                scrapy.http.Request(urljoin(response.url, url))
