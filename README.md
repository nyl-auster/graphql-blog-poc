# GRAPHQL BLOG EXAMPLE

- npm install
- npm start
- go to *localhost:4000/graphql*

## Queries

Get all the posts with their tags

```
{
   posts {
    id
    title
    content
    tags {
      id
      name
      slug
    }
  }
}
```

Get all the tags

```
{
  tags {
    id
    slug
    name
  }
}
```

Get post related to a specific tag
```
{
  postsByTagId(tagId:"a"){
    title
    content
    id
    tags {
      id
      name
      slug
    }
  }
}
```
