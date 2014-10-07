Polymer('apply-author-styles', {
  attached: function() {
    this.parent = this.parentNode;
    this.authorDocument = this.ownerDocument;
    this.fetchOriginalOwnerDocument();
  },

  fetchOriginalOwnerDocument: function() {
    var doc = this.originalAuthorDocument = document.createElement('core-ajax');
    doc.addEventListener('core-complete', this.addExternalCss.bind(this));
    doc.url = this.authorDocument.location.href;
    doc.go();
  },

  addExternalCss: function() {
    for (var i=0; i<this.authorDocument.head.children.length; i++) {
      var el = this.authorDocument.head.children[i];
      if (!this._isSupportedTag(el)) continue;
      if (!this._isFromOriginalAuthorDocument(el)) continue;

      var clone = el.cloneNode(true);
      if (clone.href != 'undefined') {
        clone.href = new URL(clone.href, document.baseURI).href;
      }
      this.parent.appendChild(clone);
    }

    // TODO: is this really the best way to handle this?
    // this.parent.host.element.convertSheetsToStyles(this.parent);
    this.element.convertSheetsToStyles(this.parent);
  },

  _isSupportedTag: function(el){
    var tagName = el.tagName.toUpperCase();
    var f = (tagName == 'LINK') || (tagName == 'STYLE'); //maybe link or LINK
    return f;
  },

  _isFromOriginalAuthorDocument: function(el) {
    var originalHtml = this.originalAuthorDocument.response;

    var re, linkPattern = el.outerHTML.replace(/\/*\s*\>/, ""); // maybe <link ... /> or <link ... >
    try { re = new RegExp(linkPattern); }
    catch (x) { return false; }

    return re.test(originalHtml);
  }
});
