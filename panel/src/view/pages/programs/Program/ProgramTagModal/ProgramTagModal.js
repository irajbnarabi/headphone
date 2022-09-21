import React, {useEffect, useState} from 'react';
import {Button, Dialog, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import './ProgramTagModal.scss';
import Image from '../../../tags/tag-modal/Image';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import JalaliUtils from '@date-io/jalaali';
import moment from 'moment';
import tagDefinitionActions from '../../../../../state/tag-definition/action';
import subscriptionActions from '../../../../../state/subscription/action';
import VideoUploader from '../../../tags/tag-modal/VideoUploader';

function ProgramTagModal({open, onClose, action, tag, actionType}) {
    const dispatch = useDispatch();
    const {tagDefinitionList, tags} = useSelector((state) => state.tagDefinitionReducer);
    const {plans} = useSelector((state) => state.subscriptionReducer);
    const [chosenTagDef, setChosenTagDef] = useState(null);
    const [chosenTag, setChosenTag] = useState(null);
    const [bindings, setBindings] = useState(null);
    const [prefix, setPrefix] = useState('');

    useEffect(() => {
        !tag && dispatch(tagDefinitionActions.getTagDefinitionList());
    }, [tag]);

    useEffect(() => {
        if (open) {
            dispatch(subscriptionActions.getPlans('ticket'));
        }
    }, [open]);

    useEffect(() => {
        if (chosenTagDef) {
            dispatch(tagDefinitionActions.getTagDefinitionTags(chosenTagDef.id, prefix || ''));
        } else {
            setChosenTag(null);
            dispatch(tagDefinitionActions.resetTags());
        }
    }, [chosenTagDef]);

    useEffect(() => {
        if (tag && tagDefinitionList) {
            setChosenTagDef(tagDefinitionList.find((item) => item.name === tag.tagDef));
            setChosenTag(tag);
            setBindings(tag.bindings);
            setPrefix(tag.value);
        }
    }, [tag, tagDefinitionList]);

    useEffect(() => {
        if (chosenTag && tags && !tag && tagDefinitionList) {
            const tempTag = tags?.find((item) => item.id === chosenTag.id) || {};
            const tempBindings = tagDefinitionList?.find((item) => item.id === tempTag.tagDefinitionId)?.bindings;
            setBindings(tempBindings);
        }
    }, [chosenTag, tag, tagDefinitionList, tags]);

    useEffect(() => {
        if (prefix && chosenTagDef) {
            dispatch(tagDefinitionActions.getTagDefinitionTags(chosenTagDef.id, prefix));
        }
    }, [prefix]);

    useEffect(() => {
        if (open && actionType === 'create') {
            setChosenTagDef(null);
            setChosenTag(null);
        }
    }, [open]);

    const handleSubmit = () => {
        const tempTag = tags?.find((item) => item.id === chosenTag.id) || {};
        tempTag.bindings = bindings && JSON.stringify(bindings) !== '[]' && JSON.stringify(bindings) !== '{}' ? bindings : {};
        action(tempTag);
        onClose();
    };

    const renderTagDefSelector = () => (
        <Autocomplete
            options={tagDefinitionList}
            value={chosenTagDef}
            disabled={!!tag}
            onChange={(e, value) => setChosenTagDef(value)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label={!tag ? 'انتخاب مشخصات تگ‌' : 'مشخصات تگ‌'} variant='outlined' />}
        />
    );

    const renderTagSelector = () => (
        <Autocomplete
            options={tags}
            value={chosenTag}
            disabled={!!tag}
            onInputChange={(e, value) => setPrefix(value)}
            onChange={(e, value) => setChosenTag(value)}
            getOptionLabel={(option) => option.value}
            freeSolo
            renderInput={(params) => <TextField {...params} label={!tag ? 'انتخاب تگ' : 'تگ'} variant='outlined' />}
        />
    );

    function RenderDateSelector({onChange, label, firstValue}) {
        return (
            <MuiPickersUtilsProvider utils={JalaliUtils} locale='fa'>
                <DatePicker
                    inputVariant='outlined'
                    fullWidth
                    label={label}
                    clearable
                    okLabel='تأیید'
                    cancelLabel='لغو'
                    clearLabel='پاک کردن'
                    labelFunc={(value) => (value ? value.format('jYYYY/jMM/jDD') : '')}
                    value={moment.unix(firstValue)}
                    onChange={(value) => onChange(value.unix())}
                />
            </MuiPickersUtilsProvider>
        );
    }

    const renderBindings = () => {
        return !!chosenTagDef && !!chosenTag && !!bindings ? (
            <div className='mtm-bindings'>
                {!!bindings && <div>داده‌های تکمیلی</div>}
                {chosenTagDef?.bindings?.map((binding, index) => {
                    if (['TEXT', 'NUMBER', 'UNIQUE'].includes(binding.type)) {
                        return (
                            <TextField
                                key={index}
                                fullWidth
                                value={bindings[binding.name] || ''}
                                onChange={(e) => setBindings({...bindings, [binding.name]: binding.type === 'NUMBER' ? +e.target.value : e.target.value})}
                                label={binding.name}
                                variant='outlined'
                                inputProps={{
                                    type: binding.type === 'NUMBER' ? 'number' : 'text',
                                }}
                            />
                        );
                    }
                    if (binding.type === 'MULTILINE') {
                        return (
                            <TextField
                                key={index}
                                fullWidth
                                value={bindings[binding.name] || ''}
                                onChange={(e) => setBindings({...bindings, [binding.name]: e.target.value})}
                                multiline
                                label={binding.name}
                                variant='outlined'
                                inputProps={{
                                    type: binding.type === 'NUMBER' ? 'number' : 'text',
                                }}
                            />
                        );
                    }
                    if (binding.type === 'TICKET') {
                        return (
                            <FormControl fullWidth key={index} className='select-type' variant='outlined'>
                                <InputLabel>{binding.name}</InputLabel>
                                <Select
                                    value={typeof bindings[binding.name] === 'string' ? [bindings[binding.name]] : bindings[binding.name] || []}
                                    onChange={(event) => setBindings({...bindings, [binding.name]: event.target.value})}
                                    label={binding.name}
                                >
                                    {plans?.map((plan) => (
                                        <MenuItem key={plan} value={plan.id}>
                                            <span style={{display: 'block', width: '100%'}}>{plan.name}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        );
                    }
                    if (binding.type === 'DATE') {
                        return (
                            <RenderDateSelector
                                key={index}
                                firstValue={bindings[binding.name]}
                                label={binding.name}
                                onChange={(date) => setBindings({...bindings, [binding.name]: date})}
                            />
                        );
                    }
                    if (binding.type === 'IMAGE') {
                        return (
                            <div key={index}>
                                <p>{binding.name}</p>
                                <img style={{width: '100%'}} src={bindings[binding.name]} alt={bindings[binding.name]} />
                                <Image key={binding} title={binding.name} handleChange={(img) => setBindings({...bindings, [binding.name]: img})} />
                            </div>
                        );
                    }
                    if (binding.type === 'VIDEO') {
                        return (
                            <div key={index}>
                                <p>{binding.name}</p>
                                {bindings[binding.name] ? (
                                    <video width='400' controls>
                                        <source src={bindings[binding.name]} type='video/mp4' />
                                        <track kind='captions' srcLang='en' label='english_captions' />
                                    </video>
                                ) : null}
                                <VideoUploader key={binding} title={binding.name} handleChange={(video) => setBindings({...bindings, [binding.name]: video})} />
                            </div>
                        );
                    }
                    if (binding.type === 'ENUM') {
                        return (
                            <FormControl fullWidth key={index} className='select-type' variant='outlined'>
                                <InputLabel>{binding.name}</InputLabel>
                                <Select
                                    value={typeof bindings[binding.name] === 'string' ? [bindings[binding.name]] : bindings[binding.name] || []}
                                    multiple
                                    onChange={(event) => setBindings({...bindings, [binding.name]: event.target.value})}
                                    label={binding.name}
                                >
                                    {binding.constraints?.map((cons) => (
                                        <MenuItem key={cons} value={cons}>
                                            {cons}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        ) : (
            <></>
        );
    };

    return (
        <Dialog
            classes={{
                root : 'program-tag-modal',
                paper: 'program-tag-modal-paper',
            }}
            open={open}
            onClose={onClose}
        >
            <b>تگ فیلم</b>
            <div className='mtm-content'>
                {renderTagDefSelector()}
                {renderTagSelector()}
                {renderBindings()}
            </div>
            <div className='mtm-action'>
                <Button fullWidth variant='contained' color='primary' onClick={handleSubmit} disabled={!tags.length}>
                    <span>ثبت</span>
                </Button>
            </div>
        </Dialog>
    );
}

export default ProgramTagModal;
