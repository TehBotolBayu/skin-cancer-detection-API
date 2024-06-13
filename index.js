const {app} = require('./app');

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});