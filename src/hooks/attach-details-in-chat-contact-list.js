// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const id = context.params.user.id;
    const role = context.params.user.role;
    let query;
    let result = [];
    result = await Promise.all(
      context.result.data.map(async user => {
        if(role === 'seeker'){
          query = user.senderId;
        }else{
          query = user.receiverId;
        }
        let details = await context.app.service('users').get(query)
        user.details = {
                      id: details.id,
                      name: details.username,
                      email: details.email,
                      profilePic: details.profilePic,
                    }
        return user
      })
    )
    context.result = result
    return context;
  };
};
