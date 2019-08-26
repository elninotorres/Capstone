const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');
const zokratesProof = require("../zokrates/code/square/proof.json");

contract('TestSolnSquareVerifier', accounts => {
    describe('Exercise SolnSquareVerifier', function () {
      beforeEach(async function () { 
        let verifierContract = await Verifier.new({from: accounts[0]});
        this.contract = await SolnSquareVerifier.new(verifierContract.address, {from: accounts[0]});
      });

      // Test if a new solution can be added for contract - SolnSquareVerifier
      it('should add new solutions', async function () { 
        let tx = await this.contract.addSolution(
          1, accounts[1],
          ...Object.values(zokratesProof.proof), zokratesProof.inputs);
        let solutionVerifiedEvent = tx.logs[0].event;
        let solutionAddedEvent = tx.logs[1].event;
        assert.equal(
          solutionVerifiedEvent, 'Verified', 'Invalid event emitted');
        assert.equal(
          solutionAddedEvent, 'SolutionAdded', 'Invalid event emitted');
      });

      // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
      it('should mint tokens for contract', async function () { 
        await this.contract.addSolution(
          1, accounts[1],
          ...Object.values(zokratesProof.proof), zokratesProof.inputs);
        let tx = await this.contract.mintNewToken(
          accounts[1], 1, {from: accounts[0]});
        let tokenTransferredEvent = tx.logs[0].event; // transferred == minted
        assert.equal(
          tokenTransferredEvent, 'Transfer', 'Invalid event emitted');
      });
  });
});