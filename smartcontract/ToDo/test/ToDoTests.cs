using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Shouldly;
using Xunit;

namespace AElf.Contracts.ToDo
{
    // This class is unit test class, and it inherit TestBase. Write your unit test code inside it
    public class ToDoTests : TestBase
    {
        [Fact]
        public async Task Update_ShouldUpdateMessageAndFireEvent()
        {
            // Arrange
            var inputValue = "Hello, World!";
            var input = new StringValue { Value = inputValue };

            // Act
            await ToDoStub.Update.SendAsync(input);

            // Assert
            var updatedMessage = await ToDoStub.Read.CallAsync(new Empty());
            updatedMessage.Value.ShouldBe(inputValue);
        }
    }
    
}