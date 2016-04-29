#Organization Chart 


##Setup:
To download:
```
git clone https://github.com/blovato/OrganizationChart
cd OrganizationChart
npm install
```



Start a MongoDB server and change the db connection url in server.js to your local instance

```js
mongoose.connect('mongodb://localhost:port/dbname');
```


To run:
```
node server.js
```


##TODO:
- [ ] Add User Permissions and Auth
- [ ] Integrate with node-IIS for hosting
- [ ] Replace MongoDB with Active Directory or Data Warehouse



##Description:
Built with Node, Express, Angular with routing, Jade templating, and MongoDB. 
The application has an editor/viewer for employee data that then generates a csv that the org chart reads from. The org chart is a separate entity from the editor/viewer and it is served statically without angular. The editor/viewer is dynamic and uses view templates to reuse code with a different data context. 
The editor/viewer has the url endpoints: `'/employee', '/employee/new', '/employee/[x]/edit'` and the orgchart is at `'/orgchart'`.





Built by Brenten Lovato - April 2016