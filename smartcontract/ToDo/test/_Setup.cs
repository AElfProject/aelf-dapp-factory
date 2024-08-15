using AElf.Cryptography.ECDSA;
using AElf.Testing.TestBase;

namespace AElf.Contracts.ToDo
{
    // The Module class load the context required for unit testing
    public class Module : ContractTestModule<ToDo>
    {
        
    }
    
    // The TestBase class inherit ContractTestBase class, it defines Stub classes and gets instances required for unit testing
    public class TestBase : ContractTestBase<Module>
    {
        // The Stub class for unit testing
        internal readonly ToDoContainer.ToDoStub ToDoStub;
        // A key pair that can be used to interact with the contract instance
        private ECKeyPair DefaultKeyPair => Accounts[0].KeyPair;

        public TestBase()
        {
            ToDoStub = GetToDoContractStub(DefaultKeyPair);
        }

        private ToDoContainer.ToDoStub GetToDoContractStub(ECKeyPair senderKeyPair)
        {
            return GetTester<ToDoContainer.ToDoStub>(ContractAddress, senderKeyPair);
        }
    }
    
}