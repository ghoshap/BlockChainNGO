/**
 * Receive new deliveries and udtate container quantitties.
 * @param {com.ngo1.ContainerDelivery} tx The container asset instance.
 * @transaction
 */
async function containerDelivery(tx) 
    {
      const DeliveryID = tx.deliveryID;
      const assetRegistryAmountReceived = await getAssetRegistry('com.ngo1.AmountReceivedAsset');
      let AmountReceivedExists = await assetRegistryAmountReceived.exists(DeliveryID);
      if(AmountReceivedExists){
        let AmountReceived = await assetRegistryAmountReceived.exists(DeliveryID);
        if(tx.amountReceived === AmountReceived.amountReceived){
          const assetRegistryBalance = await getAssetRegistry('com.ngo1.OverAllBalanceAsset');
   
          var list = await assetRegistryBalance.getAll();
          const OBalanceID = 'A' + parseInt(list.length);
          let OBalance = await assetRegistryBalance.get(OBalanceID);
          const oldBalance = OBalance.LatestBalance; 
          const newBalanceID = 'A' + (parseInt(list.length)+1);
    
    
      
    
          let newOBalance = getFactory().newResource('com.ngo1','OverAllBalanceAsset',newBalanceID);
          newOBalance.LatestBalance = oldBalance - tx.amountReceived;
          newOBalance.owner = OBalance.owner;


          await assetRegistryBalance.add(newOBalance);
         
         }}
      else{
        let newAmountReceived = getFactory().newResource('com.ngo1','AmountReceivedAsset',DeliveryID);
          newAmountReceived.amountReceived = tx.amounttobeReceived;
          newAmountReceived.quantity = tx.quantity;
       	  


          await assetRegistryAmountReceived.add(newAmountReceived);
        
        }
      
      
    
    
    const oldContainerCount = tx.containers.quantity;

    // Update the asset to what the new value is. 
    tx.containers.quantity = tx.newContainerCount;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('com.ngo1.ContainerAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.containers);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('com.ngo1', 'ContainerDeliveredEvent');
    event.containers = tx.containers;
    event.howManyBefore = oldContainerCount;
    event.howManyNow = tx.newContainerCount;
    emit(event);
    }



