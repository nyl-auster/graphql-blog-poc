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
