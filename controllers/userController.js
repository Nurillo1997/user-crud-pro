exports.home = (req, res)=>{
  const users = [
    {
      name: "Ali Valiyev",
      email: "ali@example.com",
      phone: "+998901234567",
      image: "user1.jpg",
      password: "123456"
    },
    {
      name: "Bekzod Karimov",
      email: "bekzod@example.com",
      phone: "+998909876543",
      image: "user2.jpg",
      password: "123456"
    },
    {
      name: "Dilshod Rasulov",
      email: "dilshod@example.com",
      phone: "+998933334455",
      image: "user3.jpg",
      password: "123456"
    }
  ];

  res.render('index', {title: "Home", users} );
}