exports.pageNotFoundController = (req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: req.path,
    cssPath: '/css/404.css',
  });
};
