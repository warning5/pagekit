require(['jquery', 'uikit!form-select', 'domReady!'], function($, uikit) {

    var form = $('#js-page'), id = $('input[name="id"]', form);


    // check form before leaving page

    window.onbeforeunload = (function() {

        var dirtyform;

        form.on('change', ':input', function() {
            dirtyform = true;
        }).on('submit', function() {
            dirtyform = false;
        });

        return function(e) {

            if (dirtyform) {
                return $('#unsafed-form-message').text().trim();
            }
        };
    })();

    // slug handling
    var slug  = $('input[name="page[slug]"]', form),
        title = $('input[name="page[title]"]', form);

    title.on('blur', function () {
        if (!(id.val()-0)) slug.val('');
        slug.trigger('blur');
    });

    slug.on('blur', function() {
        $.post(slug.data('url'), { slug: slug.val() || title.val(), id: id.val() }, function(data) {
            slug.val(data);
        }, 'json');
    });

    // status handling
    var status   = $('input[name="page[status]"]', form),
        statuses = $('.js-status', form).on('click', function() {
            status.val(statuses.addClass('uk-hidden').not(this).removeClass('uk-hidden').data('value'));
        });

    // markdown status handling
    var markdownStatus   = $('input[name="page[data][markdown]"]', form),
        markdownStatuses = $('.js-markdown').on('click', function() {
            markdownStatus.val(markdownStatuses.addClass('uk-hidden').not(this).removeClass('uk-hidden').data('value'));
            $('#page-content', form).trigger(markdownStatus.val() == '1' ? 'enableMarkdown' : 'disableMarkdown');
        });

    // show title checkbox
    var showtitleinput = $('input[name="page[data][title]"]', form),
        showtitle      = $('.js-title', form).on('click', function() {
            showtitleinput.val(showtitle.addClass('uk-hidden').not(this).removeClass('uk-hidden').data('value'));
        });

    var cancelButton = form.find('.js-cancel'),
        spinner      = form.find('.js-spinner');

    // form ajax saving
    form.on('submit', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        spinner.removeClass('uk-hidden');

        $.post(form.attr('action'), form.serialize(), function(response) {

            uikit.notify(response.message, response.error ? 'danger' : 'success');

            if (response.id) {
                id.val(response.id);
                cancelButton.text(cancelButton.data('labelClose'));
            }

            spinner.addClass('uk-hidden');
        });
    });

});