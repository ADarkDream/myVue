const jinrishici = require('jinrishici');
jinrishici.load(result => {
  console.log(result);
});

function a() {
    jinrishici.load(result => {
      this.msg = result.data.content
      console.log(this.msg)
    }, err => {
      console.log(err);
    })
  }

  a()