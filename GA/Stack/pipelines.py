# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo

class MongoPipeline(object):

  collection_name = 'pages'

  def __init__(self, mongo_uri, mongo_db):
    self.mongo_uri = mongo_uri
    self.mongo_db = mongo_db

  @classmethod
  # create pipeline instance from crawler
  def from_crawler(cls, crawler):
    return cls(
      mongo_uri = crawler.settings.get('MONGO_URI'),
      mongo_db = crawler.settings.get('MONGO_DB')
    )

  # called when spider is opened
  def open_spider(self, spider):
    self.client = pymongo.MongoClient(self.mongo_uri)
    self.db = self.client[self.mongo_db]

  # called when spider is closed
  def close_spider(self, spider):
    self.client.close()

  # called for every item pipeline component
  def process_item(self, item, spider):
    self.db[self.collection_name].insert(dict(item))
    return item
