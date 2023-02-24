const axios = require("axios");
exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;  
    console.log("Events--> ",JSON.parse(event.body));
    const payload = JSON.parse(event.body);
    console.log("Payload@@ ",payload);
    const repoName = payload.repoName;
    const project = payload.project;
    const workspace = payload.workspace;
    console.log("Workspace-->> ",workspace);
    const email = payload.email;
    const group = payload.group;
    try{        
      await createRepo(repoName, project, workspace, callback);
       await addUsertoGroup(email, group, workspace, callback);
        }
        catch (e) {
          const response = {
              statusCode: e.status,
              headers: {
                  'Content-Type': 'application/json',
                  "Access-Control-Allow-Headers": "*",
                  "Accessarn:aws:secretsmanager:ap-south-1:859061673455:secret:uat/oa/firestore-cNOanh-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "*"
              },
              body: JSON.stringify({ message: e.data, status: 'FAILURE' })
          };
          callback(null, response);
        }     
    };
    const token = process.env.Token;
    const url = process.env.BucketURL;
    
    const createRepo = async (repoName, project, workspace, callback) => {
        console.log("Repo--> ",repoName);
        console.log("Project--> ",project);
        console.log("Workspace--> ",workspace);
      try{
       
            const data = JSON.stringify({
                "has_wiki": true,
                "is_private": true,
                "project": {
                    "key": project
                }
            });
        
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${url}/2.0/repositories/${workspace}/${repoName}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                data: data
            };
        
            const res = await axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        
            console.log('resrepo', res); 
          
      const response = {
            statusCode: 200, 
            headers: {
              'Content-Type': 'application/json',
              'Content-Transfer-Encoding': 'base64',
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Methods": "*"      
            },
            body: JSON.stringify({"data": res})
        };
        console.log("response-->> ",response);
    //  callback(null, response);
} catch(e){
  console.log(" Error -> ",e);
  const response = {
    statusCode: e.status,
    headers: {
        'Content-Type': 'application/json',
        'Content-Transfer-Encoding': 'base64',
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify({ message: e.data, status: 'FAILURE' })
};
callback(null, response);  

}
};

const addUsertoGroup = async (email, group, workspace, callback) => {
    console.log("Email--> ",email);
    console.log("Group--> ",group);
        const workspaceA = workspace;
        console.log("Workspace in user--> ",workspaceA);
    try{
    const data = JSON.stringify({
        "email":email,
        "group_slug":group
    });
    const contentLength = Buffer.byteLength(data);
    
    const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${url}/1.0/users/${workspaceA}/invitations`,
        headers: {
            "Content-Length": contentLength,
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: data
    };
        const res = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });

    console.log('resuser', res);
    const showres = "Invitation mail sent";
    
    const response = {
        statusCode: 200, 
        headers: {
          'Content-Type': 'application/json',
          'Content-Transfer-Encoding': 'base64',
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"      
        },
        body: JSON.stringify({"data": showres})
    };
 callback(null, response);
    }catch(e){
     
  console.log(" Error -> ",e);
  const response = {
    statusCode: e.status,
    headers: {
        'Content-Type': 'application/json',
        'Content-Transfer-Encoding': 'base64',
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify({ message: e.data, status: 'FAILURE' })
};
callback(null, response);        
    }
};