using AElf.Sdk.CSharp.State;
using AElf.Types;

namespace AElf.Contracts.ToDo
{
    public class ToDoState : ContractState
    {
        public BoolState Initialized { get; set; }
        public SingletonState<Address> Owner { get; set; }
        public MappedState<string, Task> Tasks { get; set; } 
        public MappedState<string, bool> TaskExistence { get; set; }
        public StringState TaskIds { get; set; } 
        public Int32State TaskCounter { get; set; }
    }
}