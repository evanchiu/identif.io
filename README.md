## Synopsis
This is a basic node.js application for identifying a Draw Something drawing from the letters alone.
The purpose of this is less about providing something amazing or competing with (http://www.drawsomethinghints.com/) or (http://bestofdrawsomething.com/cheat) and more about learning the technologies.

## Prerequisites 
node.js and npm installed

## Install
Clone source and npm install dependencies

```bash
	git clone https://github.com/evanchiu/identif.io
	npm install
```

## Predeploy
Once the demo app is installed, you need to prepare the dictionary database

```bash
    node predeploy.js
```

## Running
Once the demo app is installed, you can run the demo from the root directory.

```bash
	node app.js
```

You may need to run the command as the super user.
```bash
	sudo node app.js
```

