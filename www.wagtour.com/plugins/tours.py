import os
import datetime
import logging
import Image


ORDER = 999
TOURS_PATH = 'tours/'
IMG_PATH = './static/img/tours'
TOURS = []
SIZES = [(300,300), (600, 600)]


from django.template import Context
from django.template.loader import get_template
from django.template.loader_tags import BlockNode, ExtendsNode

def getNode(template, context=Context(), name='subject'):
	"""
	Get django block contents from a template.
	http://stackoverflow.com/questions/2687173/
	django-how-can-i-get-a-block-from-a-template
	"""
	for node in template:
		if isinstance(node, BlockNode) and node.name == name:
			return node.render(context)
		elif isinstance(node, ExtendsNode):
			return getNode(node.nodelist, context, name)
	raise Exception("Node '%s' could not be found in template." % name)


def preBuild(site):

	global TOURS

	page_num = 0
	for page in site.pages():
		if page.path.startswith(TOURS_PATH):

			page_num += 1
			# Skip non html posts for obious reasons
			if not page.path.endswith('.html'):
				continue

			# Find a specific defined variable in the page context,
			# and throw a warning if we're missing it.
			def find(name):
				c = page.context()
				if not name in c:
					logging.info("Missing info '%s' for tour %s" % (name, page.path))
					return ''
				return c.get(name, '')

			# Build a context for each hotel
			tourContext = {}
			tourContext['title'] = find('title')
			tourContext['path'] = page.path
			tourContext['city'] = find('city')
			tourContext['description'] = [p.strip() for p in find('description').split('|')]
			tourContext['n_days'] = find('n_days')
			tourContext['price'] = find('price')
			tourContext['page_num'] = page_num
			tourContext['tour_num'] = find('tour_num')

			make_thumbs(tourContext['tour_num'])
			TOURS.append(tourContext)



def preBuildPage(site, page, context, data):
	"""
	Add the list of tours to every page context so we can
	access them from wherever on the site.
	"""
	context['tours'] = TOURS
	for tour in TOURS:
		images = get_tour_images(tour['tour_num'])
		if images:
			tour['image_rows'] = list(chunks(images, 3))
			tour['main_image'] = images[0]
		if tour['path'] == page.path:
			context.update(tour)
			context['this_tour'] = tour

	context['rows'] = list(chunks(context['tours'], 3))

	return context, data


def chunks(l, n):
    """ Yield successive n-sized chunks from l.
    http://stackoverflow.com/questions/312443/how-do-you-split-a-list-into-evenly-sized-chunks-in-python
    """
    for i in xrange(0, len(l), n):
        yield l[i:i+n]


def get_tour_images(tour_num):
    img_dir = "%s/%s/" % (IMG_PATH, tour_num)
    images = [ f for f in os.listdir(img_dir) if f.endswith('.jpg')]
    return sorted(filter(lambda i: not i.startswith('thumb_'), images))


def make_thumbs(tour_num):
    images = get_tour_images(tour_num)
    for image in images:
            image_path = "%s/%s/%s" %(IMG_PATH, tour_num, image)
            for size in SIZES:
                thumb = Image.open(image_path)
                thumb.thumbnail(size)
                thumb_name = "%s/%s/thumb_%s_%s" % (IMG_PATH, tour_num, size[0], image)
                thumb.save(thumb_name)
    


