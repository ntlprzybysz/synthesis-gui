from django import forms


class InputForm(forms.Form):
    MODEL_OPTIONS = [
        ("LJSPEECH11", "LJSpeech 1.1"),
    ]

    VOICE_OPTIONS = [
        ("LINDAJOHNSON", "Linda Johnson"),
    ]

    SENTENCE_OPTIONS = [
        (1, "Sentence 1"),
    ]

    project_name = forms.CharField(
        max_length=254,
        min_length=3,
        widget=forms.TextInput(
            attrs={"id": "project-name-field", "placeholder": "Example synthesis"}
        ),
        label="Project name:",
        initial="Example synthesis",
    )

    text_input = forms.CharField(
        max_length=500,
        required=False,
        widget=forms.Textarea(attrs={"id": "text-input-field"}),
        label="Text:",
    )

    ipa_input = forms.CharField(
        max_length=500,
        min_length=1,
        widget=forms.Textarea(attrs={"id": "ipa-input-field"}),
        label="IPA:",
    )

    model = forms.ChoiceField(
        choices=MODEL_OPTIONS,
        initial=MODEL_OPTIONS[0],
        label="Model:",
        widget=forms.Select(attrs={"id": "model-select-field"}),
    )

    voice = forms.ChoiceField(
        choices=VOICE_OPTIONS,
        initial=VOICE_OPTIONS[0],
        label="Voice:",
        widget=forms.Select(attrs={"id": "voice-select-field"}),
    )

    sentence = forms.ChoiceField(
        choices=SENTENCE_OPTIONS,
        initial=SENTENCE_OPTIONS[0],
        label="Sentence:",
        widget=forms.Select(attrs={"id": "sentence-select-field"}),
    )


    def clean_project_name(self):
        """
        Substitutes all characters that aren't a letter with an underscore.
        """
        project_name = self.cleaned_data['project_name']
        cleaned_project_name = ''.join(c if c.isalpha() else '_' for c in project_name)
        return cleaned_project_name


    def clean_text_input(self):
        """
        Discards all text input by subtituting it with an empty string.
        """
        return ""
    

    def clean_ipa_input(self):
        ipa_input = self.cleaned_data['ipa_input']
        cleaned_ipa_input = ipa_input   # TODO
        return cleaned_ipa_input