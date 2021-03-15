const { assert } = require("chai");

const Picture = artifacts.require("./Picture.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Picture", (accounts) => {
  let contract;

  before(async () => {
    contract = await Picture.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe('storage',async() => {
      it('updates the PictureHash' , async () => {
          let pictureHash 
          pictureHash = 'abc123'
          await contract.set(pictureHash)
          const result = await contract.get()
          assert.equal(result,pictureHash)
      })
  })
});
