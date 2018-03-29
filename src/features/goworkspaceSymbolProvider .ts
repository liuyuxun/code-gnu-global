import * as vscode from 'vscode';
import AbstractProvider from './abstractProvider';

export default class goworkspaceSymbolProvider  extends AbstractProvider implements vscode.WorkspaceSymbolProvider  {	
	public provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
		var self = this;
		return this._global.run(['--encode-path', '" "', '--result ctags-x -a', '"' + query + '"'])
		.then(function(output){
			console.log(output);
			var bucket: vscode.SymbolInformation[] = new Array<vscode.SymbolInformation>();
			try {
				if (output != null) {
					output.toString().split(/\r?\n/)
					.forEach(function(value, index, array){
						var result = self._global.parseLine(value);
						if (result == null)return;
						var uri : vscode.Uri = vscode.Uri.file(result.path);
						bucket.push(new vscode.SymbolInformation(result.tag, result.kind, new vscode.Range(new vscode.Position(result.line, 0), new vscode.Position(result.line, 0)), uri));
					});
				}
			}
			catch (ex){
				console.error("Error: " + ex);
			}
			return bucket;
		});
	}
}