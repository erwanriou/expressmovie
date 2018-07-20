const db = {
  user : 'erwan',
  password : '17401985illidan',
  url : function() {
    return `mongodb://${this.user}:${this.password}@ds245661.mlab.com:45661/expressmovie`
  },
  options : {
    useNewUrlParser: true,
  },
}

exports.db = db
