# MJML Component-based Email Template Boilerplate

This template uses MJML as core. 

---
<br/>

### To get started:

Run in terminal: ```yarn && yarn start```


Install live server VS code extension to preview changes:

[Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Once installed go to `localhost:5500/index.html` to view other variants

<br/>

### Creating other variants
On `/variants` folder create a new folder together with a new JSON file that contains the name of the components inside the `/components` folder.

Sample JSON file:
```
{
	"name": "sample-variant",
	"content": [
		"sample-header.mjml",
		"sample-component.mjml",
		"sample-two-column.mjml",
		"sample-footer.mjml"
	],
	"dateModified": "2022-08-04T01:49:12.384Z"
}
```

### Useful link(s):
[MJML documentation](https://documentation.mjml.io/)