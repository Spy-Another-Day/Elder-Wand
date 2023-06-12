


## API Endpoints
### User Endpoints
|    Type        |Endpoints                      |description                 |
|----------------|-------------------------------|-----------------------------|
|GET             |/user/:username                | retreives user infomation |
|POST            |/user                          | create an user          |
|PATCH          |/nickname                       |change user nickname|
|PATCH          |/password                       |change user password|



### **GET** */user/:username*
#### Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|username             |string                | Required username to identify which user data to send |

#### Response:
```
{
    "_id": "6484cea799824c4a16b529ec",
    "username": "test1",
    "nickname": "admin1",
    "email": "123@test.com",
    "password": "password123123",
    "__v": 0
 }
```
### **POST** */user*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|username             |string                | Required username for create a user |
|nickname             |string                | Required nickname for create a user |
|password             |string                | Required password for create a user |
|email             |string                | Optional for create a user email|
|salt             |string                | Optional for create a user password |



#### Response:
`
201 user created
`
### **PATCH** */nickname*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|username             |string                | Required username for identify a user |
|nickname             |string                | Required nickname for update the nickname|

#### Response:
`
200 nickname updated
`
### **PATCH** */password*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|username             |string                | Required username for identify a user |
|password             |string                | Required password for update the password|

#### Response:
`
200 password updated
`

### Words Endpoints
|    Type        |Endpoints                      |description                 |
|----------------|-------------------------------|-----------------------------|
|GET             |/topics                | retreives all topics |
|GET            |/allTopicWords                          | retreives all topics and words associate with it        |
|GET          |/words/:topic                       |retreives words for a specific topic|
|GET          |/initGame/:topic                       |retreives words in 2d array with inital game setups|
|POST          |/newTopic                       |create a new topic and words associate with it|
|PATCH          |/addNewWords                       |add new words to a exsited topic|

### **GET** */topics*
#### Parameters:
`none`

#### Response:
```
[
    {
        "_id": "6484cc729fdb0cbcd02d9d93",
        "topic": "Technology"
    },
    ...
]
```

### **GET** */allTopicWords*
#### Parameters:
`none`

#### Response:
```
[
    {
        "_id": "6484cc729fdb0cbcd02d9d93",
        "topic": "Technology",
        "words": [
            "Algorithm",
            "Analytics",
            "API",
            "Artificial Intelligence",
            "Automation",
            "Big Data",
            "Blockchain",
            "Cloud Computing",
            "Machine Learning",
            "Mobile",
            "Network",
           ...
        ],
        "__v": 0
    },
    ...
]

```

### **GET** */words/:topic*
#### Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|topic            |string                | Required topic to identify which topic data to send |

#### Response:
```
{
    "_id": "6484cc729fdb0cbcd02d9d93",
    "topic": "Technology",
    "words": [
        "Algorithm",
        "Analytics",
        "API",
        "Artificial Intelligence",
        "Automation",
        "Big Data",
        ...
    ],
    "__v": 0
}
```

### **GET** */initGame/:topic*
#### Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|topic            |string                | Required topic to identify which topic data to send |

#### Query Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|cards            |integer                | Optional total number of cards, default 25 |
|assassins            |integer                | Optional total number of assassin cards, default 1 |
|agents            |integer                | Optional total number of agents per team, default 8 |

#### Response:
```
{
    "topic": "Technology",
    "team_1_guessed": 0,
    "team_2_guessed": 0,
    "team_1_guess_goal": 8,
    "team_2_guess_goal": 9,
    "startUpTeam": "1",
    "currentTeam": "1",
    "words": [
        [
            {
                "word": "Data Science",
                "belongsTo": "bystander",
                "isTouched": false
            },
            {
                "word": "Firmware",
                "belongsTo": "bystander",
                "isTouched": false
            },
            {
                "word": "Network",
                "belongsTo": "0",
                "isTouched": false
            },
            ...
        ],
        ...
    ]
}

```

### **POST** */newTopic*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|topic            |string                | Required topic for create a topic with words associate with it |
|words             |array of strings                | Required words for create a topic with words associate with it |


#### Response:
`
201 topic created
`

### **PUT** */addNewWords*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|topic            |string                | Required topic for identify a topic to add new words to it |
|words             |array of strings                | Required words to add new words to the topic |


#### Response:
`
200 words added
`


### Group Endpoints
|    Type        |Endpoints                      |description                 |
|----------------|-------------------------------|-----------------------------|
|GET             |/groups                | retreives all groups information|
|GET            |/group/:groupName                          | retreives a specific group information  |
|POST          |/group                       |create a new group associate with its members|
|PUT          |/groupMember                       |add new members to a group|
|PATCH          |/groupName                       |update group name|
|DELETE          |/groupMember                       |delete one group member|
|DELETE         |/group/:groupName                       |delte a group|


### **GET** */groups*
#### Parameters:
`none`

#### Response:
```
[
    {
        "_id": "6484faf9032fdf604cd22a5b",
        "groupName": "group1",
        "groupMembers": [
            "member1",
            "member2"
        ],
        "__v": 0
    },
    ...
]
```

### **GET** */group/:groupName*
#### Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|groupName            |string                | Required group name to identify which group data to send |

#### Response:
```
{
    "_id": "6484faf9032fdf604cd22a5b",
    "groupName": "group1",
    "groupMembers": [
        "member1",
        "member2"
    ],
    "__v": 0
}
```

### **POST** */group*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|groupName            |string                | Required group name for create a group with members associate with it, groupName needs to be unique |
|groupMembers             |array of strings                | Required members for create a group with members associate with it |


#### Response:
`
201 group created
`

### **PUT** */groupMember*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|groupName            |string                | Required group name for identify which group to add the new members |
|groupMembers             |array of strings                | Required members for join a group |


#### Response:
`
200 member added
`

### **PATCH** */groupName*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|currentGroupName            |string                | Required current group name for identify which group to change the name |
|changeToGroupName             |string              | Required new group name to change the group name|


#### Response:
`
200 group name updated
`

### **DELETE** */groupMember*
#### Body Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|groupName            |string                | Required group name for identify which group to delete a member|
|groupMember             |string              | Required one member to indecate who to delete|


#### Response:
`
200 member deleted
`

### **DELETE** */group/:groupName*
#### Parameters:
|    Parameter        |type                      |description                 |
|----------------|-------------------------------|-----------------------------|
|groupName            |string                | Required group name for identify which group to delete |


#### Response:
`
200 group deleted
`