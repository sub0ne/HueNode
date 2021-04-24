# Table of contents

    1. Installation
    2. Configuration
        2.1 Configuration
        2.2 Devices
            2.2.1 Lights
            2.2.1.1 State change handler
            2.2.2 Sensors
        2.3 Groups
    3. Example configuration
        3.1 Configuration.json
        3.2 Devices.json
        3.3 Groups.json
    
# 1. Installation

To install HueNode simply enter

    npm install

from within the apps root folder and start the app by entering

    node HueNode.js

# 2. Configuration

The main configuration for the app takes place in the 'data' folder. All the configuration is stored as json files.

## 2.1 Configuration

The file 'Configuration.json' is basically created on first run and does not need any further attention. It consists of several attributes representing the main HueNode configuration:

    "name"              the name of the emulated hue, default is "HueNode Hue"
    "uuid"              a genereated uuid of the Hue instance
    "serialNumber"      a generated serial number of the Hue instance
    "modelID"           the model ID of the Hue instance, default is "BSB002"
    
## 2.2 Devices

Devices like lights and sensors (not yet supported) are configured in this file

### 2.2.1 Lights

Parameters of a light device:

    "deviceID"          the ID of the device
    "templateType"      the template type of the device in the templates folder
                        - "dimmable_light"
                        - "extended_color_light"
    "name"              the name of the device
    "uniqueID"          a generated uuid of the device

#### 2.2.1.1 State change handler

It is possible to register state change handler which then will be executed upon state change.

Possible types:

    httpRequest     execute a http request forwarding state changes, useful for e.g. ioBroker

For configuration example see 3.2.

### 2.2.2 Sensors
        
Sensors are not yet supported

## 2.3 Groups

Parameters of a group device:

    "groupID"       the ID of the group
    "type"          the type of the group according to the Hue API (https://developers.meethue.com/develop/hue-api/groupds-api/)

                    LightGroup       LightGroups use class 'Other'
                    Room             
                    Luminaire        (not yet supported)
                    LightSource      (not yet supported)


    "name"          "My room #1",
    "lights"        
    "class"         the class of the group according to the Hue API (https://developers.meethue.com/develop/hue-api/groupds-api/)

                    Living room
                    Kitchen
                    Dining
                    Bedroom
                    Kids bedroom
                    Bathroom
                    Nursery
                    Recreation
                    Office
                    Gym
                    Hallway
                    Toilet
                    Front door
                    Garage
                    Terrace
                    Garden
                    Driveway
                    Carport
                    Other

                    >1.30:
                    Home
                    Downstairs
                    Upstairs
                    Top floor
                    Attic
                    Guest room
                    Staircase
                    Lounge
                    Man cave
                    Computer
                    Studio
                    Music
                    TV
                    Reading
                    Closet
                    Storage
                    Laundry room
                    Balcony
                    Porch
                    Barbecue
                    Pool

# 3. Example Configuration

## 3.1 Configuration.json

```json
{
    "name": "HueNode Hue",
    "uuid": "da339446-ecab-4385-8f61-933ba188f810",
    "serialNumber": "933ba188f810",
    "modelID": "BSB002"
}
```

## 3.2 Devices.json

```json
{
    "lights": [
        {
            "deviceID": "1",
            "templateType": "dimmable_light",
            "name": "Virtual Light #1",
            "uniqueID": "93:B2:95:B0:F2:C1:4D:D9-01",
            "stateChangeHandler": {
                "on": [
                    {
                        "type": "httpRequest",
                        "url": "http://www.google.de?bri={bri}&sat={sat}"
                    }
                ]
            }
        },
        {
            "deviceID": "2",
            "templateType": "dimmable_light",
            "name": "Virtual Light #2",
            "uniqueID": "F0:FA:EC:0D:E5:DD:3A:B2-01"
        }
    ]
}
```

## 3.3 Groups.json

```json
{
    "groups": [
        {
            "groupID": "100",
            "type": "Room",
            "name": "My room #1",
            "lights": [
                "1"
            ],
            "class": "Living room"
        },
        {
            "groupID": "101",
            "type": "LightGroup",
            "name": "My light group #1",
            "lights": [
                "1",
                "2"
            ],
            "class": "Other"
        }
    ]
}    
```
