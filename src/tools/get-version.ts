/**
 * Get version MCP tool
 */

/**
 * Get service version information
 *
 * @returns MCP tool response with version info
 */
export async function getVersionTool() {
  return {
    content: [
      {
        type: 'text',
        text: `Stream Workflow Status v0.1.0\n\nMCP Server for real-time stream tracking and dashboard`,
      },
    ],
  };
}
