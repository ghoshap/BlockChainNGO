/**
 * Receive new donations and udate the balance.
 * @param {com.ngo1.Donation} tx The donation asset instance.
 * @transaction
 */
async function donation(tx) 
    {
    
      
    const assetRegistryBalance = await getAssetRegistry('com.ngo1.OverAllBalanceAsset');
    // Update the asset in the asset registry.
    var list = await assetRegistryBalance.getAll();
    const OBalanceID = 'A' + parseInt(list.length);
    let OBalance = await assetRegistryBalance.get(OBalanceID);
    const oldBalance = OBalance.LatestBalance; 
    const newBalanceID = 'A' + (parseInt(list.length)+1);
    
    
      
    
    let newOBalance = getFactory().newResource('com.ngo1','OverAllBalanceAsset',newBalanceID);
    newOBalance.LatestBalance = oldBalance + tx.DonatedAmount;
    newOBalance.owner = OBalance.owner;
    //newDonation.newBalance = oldBalance + tx.donations.donatedAmount;
    
    await assetRegistryBalance.add(newOBalance);
    //const oldBalance = tx.DonatedAmount;

    // Update the asset to what the new value is. 
    //tx.donations.donatedAmount = tx.newBalance;
    //tx.newBalance = oldBalance + tx.donations.donatedAmount;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('com.ngo1.DonatedAmountAsset');
    // Update the asset in the asset registry.
    var list = await assetRegistry.getAll();
    const AssetID = "D" + (parseInt(list.length) +1);
    let newDonation = getFactory().newResource('com.ngo1','DonatedAmountAsset',AssetID);
    newDonation.donatedAmount = tx.DonatedAmount;
    newDonation.owner = tx.owner;
    //newDonation.newBalance = oldBalance + tx.donations.donatedAmount;
    
    await assetRegistry.add(newDonation);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('com.ngo1', 'DonationEvent');
    event.donations = newDonation;
    event.balanceBefore = oldBalance;
    event.balanceNow = oldBalance + tx.DonatedAmount;
    emit(event);
    }
