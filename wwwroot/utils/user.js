let users = [];

// Join user to chat
function userJoin(name, color, count, id) {
    let user = {
        "name": name,
        "color": color,
        "count": count,
        "id": id,
        "msg": "testing"
    };

    users.push(user);

    return user;
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function findUser(id) {
    return users.filter(user => user.id === id);
}

module.exports = {
    userJoin,
    users,
    userLeave,
    findUser
};