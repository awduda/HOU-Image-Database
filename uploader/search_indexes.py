import datetime
from haystack import indexes
from uploader.models import image_model_main


class ImageIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    observer = indexes.CharField(model_attr='observatory_name')
    observatory = indexes.CharField(model_attr='observatory_name')
    telescope = indexes.CharField(model_attr='telescope_name')
    object_name = indexes.CharField(model_attr='object_name', null=True)
    other_header_data = indexes.CharField(model_attr='header_data_other')


    #pub_date = indexes.DateTimeField(model_attr='pub_date')

    def get_model(self):
        return image_model_main

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects
