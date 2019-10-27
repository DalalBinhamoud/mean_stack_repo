import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import {ChatService} from '../chat.service'


const THEME = 'ace/theme/github'; 
const LANG = 'ace/mode/javascript';
declare var $: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers:[ChatService]
})
export class EditorComponent implements OnInit {
  @Input() id: any;
  answer_editor: any;


  @ViewChild('codeEditor',{static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
   teamsCounter:number = 1;


  constructor(private _chatService: ChatService) { }

  ngOnInit() {
   
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.getEditorOptions();

    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true);
 
 
    this.editorBeautify = ace.require('ace/ext/beautify');
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
        highlightActiveLine: true,
        minLines: 14,
        maxLines: Infinity,
    };

    const extraEditorOptions = {
        enableBasicAutocompletion: true
    };
    const margedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    return margedOptions;
}

public beautifyContent() {
  if (this.codeEditor && this.editorBeautify) {
     const session = this.codeEditor.getSession();
     this.editorBeautify.beautify(session);
  }
}

write_code(){
  console.log("here in answer editor");
  console.log(this.answer_editor);
  console.log('name:', this.id)
  this._chatService.write_code({answer: this.answer_editor, id: this.id})
}

done () {
  this.codeEditor.setReadOnly(true)
  this._chatService.change_color(this.id)
  }

}
