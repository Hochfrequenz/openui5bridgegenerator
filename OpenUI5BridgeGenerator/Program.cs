using System;

namespace OpenUI5BridgeGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            new Compiler().Compile(args[0],System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(),"out"));
        }
    }
}
