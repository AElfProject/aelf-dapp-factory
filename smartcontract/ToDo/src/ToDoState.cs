using AElf.Sdk.CSharp.State;
using AElf.Types;

namespace AElf.Contracts.ToDo
{
    public class ToDoState : ContractState
    {
        public BoolState Initialized { get; set; }
        public SingletonState<Address> Owner { get; set; }
        public MappedState<string, Task> Tasks { get; set; } // Mapping of task ID to Task
        public MappedState<string, bool> TaskExistence { get; set; } // Mapping to track task existence
        public StringState TaskIds { get; set; } // Concatenated string of task IDs
        public Int32State TaskCounter { get; set; } // Counter for generating unique IDs
    }
}
