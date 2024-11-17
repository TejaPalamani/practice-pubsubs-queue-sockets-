import {createClient} from "redis";

//worker simply takes the work and do it here the work is printing it in server :)
const redisclient =  createClient();
const reidsPublisher = createClient();// here publicher publishes the event and sub need to catch it (same like websockets)

(async () => {

    try{

    
    await redisclient.connect();
    await reidsPublisher.connect();

    while(1){

        
        //now imp part worker will continusly do polling for work
       const task=  await redisclient.rPop("adding_to_que" , 0);
        // 0 is for waiting herr if i keep the rpop directly if the que is empty i get nill in return 
        //to avoid this brpop or blpop to wait for the que not to be empty here 0 is wait time 

        await new Promise((resolve) => (setTimeout(resolve, 1000)));// making this hold for one min

        if(task) await reidsPublisher.publish("publisherEvent" , task);

        if(task) console.log(`work is done here in worker-----${task}`);

    }
}catch(e){
    console.log(e.message)   
}

})();