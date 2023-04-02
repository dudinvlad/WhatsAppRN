import { API, graphqlOperation, Auth } from 'aws-amplify';

export const getCommonChatRoomWithUser = async (userId) => {
    const authUser = await Auth.currentAuthenticatedUser();
    // get user1's chat rooms

    const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    )

    const myChatRooms = response.data?.getUser?.ChatRooms?.items || [];//[0].chatRoom.users.items[0].user.id;
    console.log(myChatRooms);

    const chatRoom = myChatRooms.find((item) => {
        return item.chatRoom.users.items.some((userItem) =>
            userItem.user.id === userId
        )
    })

    return chatRoom;
    // get user2's chat rooms

    // filter chat rooms more than 2 users

    // get their common chat room
}

export const listChatRooms = /* GraphQL */ `
query GetUser($id: ID!) {
    getUser(id: $id) {
        id
        ChatRooms {
            items {
                chatRoom {
                    id
                    users {
                        items {
                            user {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
}
`