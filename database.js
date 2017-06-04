/**
 * On simule une base de données avec quelques billets et tags
 */
module.exports = {
  posts: [
    {
      id: 'a',
      title: 'alice',
      content:"contenu du post a",
      tagsIds:["b"]
    },
    {
      id: 'b',
      title: 'bob',
      content: "contenu du post b",
      tagsIds:["a"]
    }
  ],
  tags: [
    {
      id: "a",
      name:"JavaScript",
      slug: "javascript"
    },
    {
      id: "b",
      name:"Drupal",
      slug: "drupal"
    }
  ]
}
