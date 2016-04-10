(function ($) {
    var BookAPIKey = '808e6e47bbfd8bd881e86b41fe5357bb:19:74967196';
    var FADEOUT_TIME = 400;

    // page elements
    var $loading = $('.loading');
    var $catSelect = $('#category');
    var $catTitle = $('.category-title');
    var $bookList = $('.book-list');

    _setLoading(true);

    // load list of categories
    $.ajax('http://api.nytimes.com/svc/books/v3/lists/names', {
        data: {
            'api-key': BookAPIKey
        },
        success: function (res) {
            if (res && res.results) {
                res.results.forEach(function (cat) {
                    $catSelect.append($('<option>', {
                        value: cat['list_name_encoded'],
                        text: cat['display_name']
                    }));
                });
            }

            _setLoading(false);
        }
    });

    // watch for change in category selection
    $catSelect.on('change', function (e) {
        var cat = $catSelect.val();
        $catTitle.text(cat);

        _setLoading(true);

        // load new list of books
        $.ajax('http://api.nytimes.com/svc/books/v3/lists', {
            data: {
                'api-key': BookAPIKey,
                'list-name': cat
            },
            success: function (res) {

                if (res && res.results) {

                    res.results.forEach(function (book) {
                        $bookList.append(_bookElement(book));
                    });
                }

                _setLoading(false);
            }
        });
    });

    // create a DOM element populated with book data
    function _bookElement(book) {
        var bookDetails = book['book_details'][0];

        var $container = $('<div>').addClass('panel');
        var $body = $('<div>').addClass('panel-body');
        var $header = $('<div>').addClass('panel-heading');

        $container.append($header);
        $container.append($body);

        $header.append($('<h3>').append(
            $('<a>').attr('href', book['amazon_product_url'])
                .text(bookDetails.title))
        );
        $body.append($('<em>').text(bookDetails.contributor));
        $body.append($('<p>').text(bookDetails.description));

        return $container;
    }

    function _setLoading(loading) {
        if (loading) {
            $loading.fadeIn(FADEOUT_TIME);
        } else {
            $loading.fadeOut(FADEOUT_TIME);
        }
    }

})(jQuery);