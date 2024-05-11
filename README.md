# Steam Dedicated Server

IaC and code to configure a dedicated server for games in Steam. The general plan is:

* Build a general framework for Steam-based dedicated server initialization
* Make the framework extensible for features like
  * Steam app ID
  * Save file location backups to S3
  * Server customization file config
  * Anything else?
* Run the game on ECS. Basically every server I've seen has a Dockerfile somewhere
* Backup saves to S3
* Use an NLB to get a hostname. Maybe include CloudFlare DNS?
