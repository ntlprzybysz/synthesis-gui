from django import forms


class InputForm(forms.Form):

    MODEL_OPTIONS = [
        ("LJSPEECH11", "LJSpeech 1.1"),
    ]
    VOICE_OPTIONS = [
        ("LINDAJOHNSON", "Linda Johnson"),
    ]
    SENTENCE_OPTIONS = [
        ("SENTENCE1", "Sentence 1"),
    ]

    project_name = forms.CharField(
        max_length=254, 
        min_length=3, 
        widget=forms.TextInput({"placeholder": "Example synthesis"}),
        label="Project name:",
        initial="Example synthesis",
        help_text="Provide a name for your project (min. 3 characters)."
    )
    text_input = forms.CharField(
        max_length=500,
        required=False,
        widget=forms.Textarea(),
        help_text="Add a version of the IPA input in the form of plain text for your reference (optional)."
    )
    ipa_input = forms.CharField(
        max_length=500,
        min_length=1,
        widget=forms.Textarea(),
        help_text="Provide IPA input for synthesis (min. 1 character)."
    )
    model = forms.ChoiceField(
        choices=MODEL_OPTIONS, 
        initial=MODEL_OPTIONS[0], 
        label="Model:"
    )
    voice = forms.ChoiceField(
        choices=VOICE_OPTIONS, 
        initial=VOICE_OPTIONS[0], 
        label="Voice:"
    )
    sentence = forms.ChoiceField(
        choices=SENTENCE_OPTIONS, 
        initial=SENTENCE_OPTIONS[0],
        label="Sentence:"
    )

    def clean(self):
        cleaned_data = super(InputForm, self).clean()
        text_input = cleaned_data.get("text_input")
        ipa_input = cleaned_data.get("ipa_input")
        if not ipa_input:
            raise forms.ValidationError("The IPA input field cannot be submitted empty.")